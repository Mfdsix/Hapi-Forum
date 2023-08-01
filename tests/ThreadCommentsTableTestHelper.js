/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadCommentsTableTestHelper = {
  async seed (userId = 'user-1') {
    const { id, content, threadId } = {
      id: 'comment-1',
      threadId: 'thread-1',
      content: 'test'
    }
    const createdAt = new Date().toISOString()
    const query = {
      text: 'INSERT INTO thread_comments (id, thread, content, owner, created_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, threadId, content, userId, createdAt]
    }

    await pool.query(query)
    return id
  },

  async reply (commentId = 'comment-1', userId = 'user-1') {
    const { id, content, threadId } = {
      id: 'comment-2',
      content: 'comment test reply',
      threadId: 'thread-1'
    }
    const createdAt = new Date().toISOString()
    const query = {
      text: 'INSERT INTO thread_comments (id, thread, parent, content, owner, created_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, threadId, commentId, content, userId, createdAt]
    }

    const result = await pool.query(query)
    return result.rows[0].id
  },

  async cleanTable () {
    await pool.query('TRUNCATE TABLE thread_comments')
  }
}

module.exports = ThreadCommentsTableTestHelper
