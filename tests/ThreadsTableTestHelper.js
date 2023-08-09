/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')
const UsersTableTestHelper = require('./UsersTableTestHelper')

const ThreadsTableTestHelper = {
  async seed (userId = null) {
    let finalUserId

    if (!userId) {
      await UsersTableTestHelper.cleanTable()
      const { id: newUserId } = await UsersTableTestHelper.addUser()
      finalUserId = newUserId
    } else {
      finalUserId = userId
    }

    const { id, title, body } = {
      id: 'thread-123',
      title: 'test',
      body: 'body of test'
    }
    const createdAt = new Date().toISOString()
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, owner',
      values: [id, title, body, finalUserId, createdAt]
    }

    const result = await pool.query(query)
    return result.rows[0]
  },

  async cleanTable () {
    await pool.query('DELETE FROM threads')
  }
}

module.exports = ThreadsTableTestHelper
