const InvariantError = require('../../Commons/exceptions/InvariantError')
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
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (result.rows.length !== 1) {
      throw new InvariantError('thread tidak ditemukan')
    }

    return result.rows[0]
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

  async updateById (id, payload) {
    const { title, body } = payload

    const query = {
      text: 'UPDATE threads SET title = $1, body = $2 WHERE id = $3 RETURNING id',
      values: [title, body, id]
    }
    const result = await this._pool.query(query)

    if (result.rows.length !== 1) {
      throw new InvariantError('thread tidak ditemukan')
    }

    return result.rows[0].id
  }

  async deleteById (id) {
    const query = {
      text: 'DELETE FROM threads WHERE id = $1 RETURNING id',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (result.rows.length !== 1) {
      throw new InvariantError('thread tidak ditemukan')
    }

    return result.rows[0].id
  }
}

module.exports = ThreadRepositoryPostgres
