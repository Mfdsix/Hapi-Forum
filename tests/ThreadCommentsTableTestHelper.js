/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadCommentsTableTestHelper = {
  async seed () {
    const { id, threadId, content, owner } = {
      id: 'comment-1',
      threadId: 'thread-1',
      content: 'test',
      owner: 'user-1'
    }
    const createdAt = new Date().toISOString()
    const query = {
      text: 'INSERT INTO thread_comments (id, thread, content, owner, created_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, threadId, content, owner, createdAt]
    }

    await pool.query(query)
    return id
  },

  async reply (commentId = 'comment-1') {
    const { id, threadId, content, owner } = {
      id: 'comment-2',
      threadId: 'thread-1',
      content: 'comment test reply',
      owner: 'user-1'
    }
    const createdAt = new Date().toISOString()
    const query = {
      text: 'INSERT INTO thread_comments (id, thread, parent, content, owner, created_at) VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, commentId, content, owner, createdAt]
    }

    await pool.query(query)
  },

  async cleanTable () {
    await pool.query('TRUNCATE TABLE thread_comments')
  }
}

module.exports = ThreadCommentsTableTestHelper
