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

  async getByThreadId (threadId) {
    const query = {
      text: `SELECT c.*, u.username
      FROM thread_comments c
      LEFT JOIN users u ON u.id = c.owner
      WHERE c.thread = $1 AND c.parent IS NULL
      ORDER BY c.created_at ASC`,
      values: [threadId]
    }
    const result = await this._pool.query(query)

    return result.rows
  }

  async getReplyByCommentId (commentId) {
    const query = {
      text: `SELECT c.*, u.username
      FROM thread_comments c
      LEFT JOIN users u ON u.id = c.owner
      WHERE c.parent = $1
      ORDER BY c.created_at ASC`,
      values: [commentId]
    }
    const result = await this._pool.query(query)

    return result.rows
  }

  async getById (id) {
    const query = {
      text: `SELECT c.*, u.username
      FROM thread_comments c
      LEFT JOIN users u ON u.id = c.owner
      WHERE c.id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async create (payload) {
    const { threadId, content, owner } = payload
    const id = `comment-${this._idGenerator()}`
    // const createdAt = new Date().toISOString()

    const query = {
      text: `INSERT INTO thread_comments 
      (id, thread, content, owner)
      VALUES ($1, $2, $3, $4) RETURNING id, content, owner`,
      values: [id, threadId, content, owner]
    }
    const result = await this._pool.query(query)

    return new CreatedThreadComment({ ...result.rows[0] })
  }

  async reply (payload) {
    const { parentId, threadId, content, owner } = payload
    const id = `comment-${this._idGenerator()}`
    // const createdAt = new Date().toISOString()

    const query = {
      text: `INSERT INTO thread_comments 
      (id, thread, content, owner, parent)
      VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner`,
      values: [id, threadId, content, owner, parentId]
    }
    const result = await this._pool.query(query)

    return new CreatedThreadComment({ ...result.rows[0] })
  }

  async updateById (payload) {
    const { id, content, userId } = payload

    const query = {
      text: 'UPDATE thread_comments SET content = $1 WHERE id = $2 AND owner = $3 RETURNING id',
      values: [content, id, userId]
    }
    const result = await this._pool.query(query)

    return result.rows[0].id
  }

  async deleteById ({
    id, userId
  }) {
    const deletedAt = new Date().toISOString()

    const query = {
      text: 'UPDATE thread_comments SET deleted_at = $1 WHERE id = $2 AND owner = $3 RETURNING id',
      values: [deletedAt, id, userId]
    }
    const result = await this._pool.query(query)

    return result.rows[0].id
  }

  async checkAvailability (commentId) {
    const query = {
      text: `SELECT c.*, u.username
      FROM thread_comments c
      LEFT JOIN users u ON u.id = c.owner
      WHERE c.id = $1`,
      values: [commentId]
    }
    const result = await this._pool.query(query)

    if (result.rows.length !== 1) {
      throw new NotFoundError('komentar tidak ditemukan')
    }
  }

  async checkAccess ({
    commentId,
    userId
  }) {
    const query = {
      text: `SELECT c.*, u.username
      FROM thread_comments c
      LEFT JOIN users u ON u.id = c.owner
      WHERE c.id = $1 AND c.owner = $2`,
      values: [commentId, userId]
    }
    const result = await this._pool.query(query)

    if (result.rows.length !== 1) {
      throw new AuthorizationError('tidak dapat mengakses komentar')
    }
  }
}

module.exports = ThreadCommentRepositoryPostgres
