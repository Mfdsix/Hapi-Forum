/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
  async seed (userId = 'owner-1') {
    const { id, title, body } = {
      id: 'thread-123',
      title: 'test',
      body: 'body of test'
    }
    const createdAt = new Date().toISOString()
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, title, body, userId, createdAt]
    }

    const result = await pool.query(query)
    return result.rows[0].id
  },

  async cleanTable () {
    await pool.query('TRUNCATE TABLE threads')
  }
}

module.exports = ThreadsTableTestHelper
