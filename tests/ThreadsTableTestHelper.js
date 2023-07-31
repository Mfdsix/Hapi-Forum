/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
  async seed () {
    const { id, title, body, owner } = {
      id: 'thread-123',
      title: 'test',
      body: 'body of test',
      owner: 'owner-1'
    }
    const createdAt = new Date().toISOString()
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, createdAt]
    }

    await pool.query(query)
  },

  async cleanTable () {
    await pool.query('TRUNCATE TABLE threads')
  }
}

module.exports = ThreadsTableTestHelper
