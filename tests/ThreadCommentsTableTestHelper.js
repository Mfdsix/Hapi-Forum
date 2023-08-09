/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')
const UsersTableTestHelper = require('./UsersTableTestHelper')

const ThreadCommentsTableTestHelper = {
  async seed (payload = {}) {
    let userId
    const {
      id = 'comment-1',
      threadId = 'thread-1',
      content = 'test'
    } = payload

    if (!payload.userId) {
      await UsersTableTestHelper.cleanTable()
      const { id: newUserId } = await UsersTableTestHelper.addUser()
      userId = newUserId
    } else {
      userId = payload.userId
    }

    const query = {
      text: 'INSERT INTO thread_comments (id, thread, content, owner) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, threadId, content, userId]
    }

    const result = await pool.query(query)
    return result.rows[0].id
  },

  async reply (payload = {}) {
    let userId
    const {
      commentId = 'comment-1',
      id = 'comment-2',
      content = 'comment test reply',
      threadId = 'thread-1'
    } = payload

    if (!payload.userId) {
      await UsersTableTestHelper.cleanTable()
      const { id: newUserId } = await UsersTableTestHelper.addUser()
      userId = newUserId
    } else {
      userId = payload.userId
    }

    const query = {
      text: 'INSERT INTO thread_comments (id, thread, parent, content, owner) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, threadId, commentId, content, userId]
    }

    const result = await pool.query(query)
    return result.rows[0].id
  },

  async cleanTable () {
    await pool.query('DELETE FROM thread_comments')
  }
}

module.exports = ThreadCommentsTableTestHelper
