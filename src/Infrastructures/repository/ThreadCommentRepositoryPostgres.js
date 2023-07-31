const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const CreatedThreadComment = require('../../Domains/thread-comments/entities/CreatedThreadComment')
const ThreadCommentRepository = require('../../Domains/thread-comments/ThreadCommentRepository')

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async getByThreadId (threadId, includeReplies = true) {
    const query = {
      text: 'SELECT id, content, owner FROM thread_comments WHERE thread = $1 AND parent IS NULL',
      values: [threadId]
    }
    const result = await this._pool.query(query)

    if (result.rows.length > 0 && includeReplies) {
      for (let i = 0; i < result.rows.length; i++) {
        const replies = await this.getReplyByCommentId(result.rows[i].id)
        result.rows[i].replies = replies
      }
    }

    return result.rows
  }

  async getReplyByCommentId (commentId) {
    const query = {
      text: 'SELECT id, content, owner FROM thread_comments WHERE parent = $1',
      values: [commentId]
    }
    const result = await this._pool.query(query)

    return result.rows
  }

  async getById (id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (result.rows.length !== 1) {
      throw new NotFoundError('komentar tidak ditemukan')
    }

    return result.rows[0]
  }

  async create (payload) {
    const { threadId, content, owner } = payload
    const id = `comment-${this._idGenerator()}`
    const createdAt = new Date().toISOString()

    const query = {
      text: `INSERT INTO thread_comments 
      (id, thread, content, owner, created_at)
      VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner`,
      values: [id, threadId, content, owner, createdAt]
    }
    const result = await this._pool.query(query)

    return new CreatedThreadComment({ ...result.rows[0] })
  }

  async reply (payload) {
    const { id: parentId, threadId, content, owner } = payload
    const id = `comment-${this._idGenerator()}`
    const createdAt = new Date().toISOString()

    const query = {
      text: `INSERT INTO thread_comments 
      (id, thread, content, owner, created_at, parent)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, owner`,
      values: [id, threadId, content, owner, createdAt, parentId]
    }
    const result = await this._pool.query(query)

    return new CreatedThreadComment({ ...result.rows[0] })
  }

  async updateById (payload) {
    const { id, content, userId } = payload

    await this.getById(id)

    const query = {
      text: 'UPDATE thread_comments SET content = $1 WHERE id = $2 AND owner = $3 RETURNING id',
      values: [content, id, userId]
    }
    const result = await this._pool.query(query)

    if (result.rows.length !== 1) {
      throw new AuthorizationError('tidak dapat mengakses komentar')
    }

    return result.rows[0].id
  }

  async deleteById ({
    id, userId
  }) {
    await this.getById(id)

    const query = {
      text: 'DELETE FROM thread_comments WHERE id = $1 AND owner = $2 RETURNING id',
      values: [id, userId]
    }
    const result = await this._pool.query(query)

    if (result.rows.length !== 1) {
      throw new AuthorizationError('tidak dapat mengakses komentar')
    }

    return result.rows[0].id
  }
}

module.exports = ThreadCommentRepositoryPostgres
