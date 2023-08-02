const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const CreatedThread = require('../../Domains/threads/entities/CreatedThread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async getAll () {
    const query = 'SELECT id, title, owner FROM threads'
    const result = await this._pool.query(query)

    return result.rows
  }

  async getById (id) {
    const query = {
      text: `SELECT
      t.id, t.title, t.body, t.created_at, u.username
      FROM threads t
      LEFT JOIN users u ON u.id = t.owner
      WHERE t.id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)

    if (result.rows.length !== 1) {
      throw new NotFoundError('thread tidak ditemukan')
    }

    return this._transformData(result.rows[0])
  }

  async create (payload) {
    const { title, body, owner } = payload
    const id = `thread-${this._idGenerator()}`
    const createdAt = new Date().toISOString()

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, createdAt]
    }

    const result = await this._pool.query(query)

    return new CreatedThread({ ...result.rows[0] })
  }

  async updateById (payload) {
    const { id, title, body, userId } = payload

    await this.getById(id)

    const query = {
      text: 'UPDATE threads SET title = $1, body = $2 WHERE id = $3 AND owner = $4 RETURNING id',
      values: [title, body, id, userId]
    }
    const result = await this._pool.query(query)

    if (result.rows.length !== 1) {
      throw new AuthorizationError('tidak dapat mengakses thread')
    }

    return result.rows[0].id
  }

  async deleteById ({
    id, userId
  }) {
    await this.getById(id)

    const query = {
      text: 'DELETE FROM threads WHERE id = $1 AND owner = $2 RETURNING id',
      values: [id, userId]
    }
    const result = await this._pool.query(query)

    if (result.rows.length !== 1) {
      throw new AuthorizationError('tidak dapat mengakses thread')
    }

    return result.rows[0].id
  }

  async checkAvailability (id) {
    return this.getById(id)
  }

  _transformData (data) {
    return {
      id: data.id,
      title: data.title,
      body: data.body,
      username: data.username,
      date: data.created_at
    }
  }
}

module.exports = ThreadRepositoryPostgres
