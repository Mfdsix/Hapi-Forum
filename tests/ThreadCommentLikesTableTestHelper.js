/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadCommentLikesTableTestHelper = {
  async seed (payload = {}) {
    const {
      id = 'like-' + (Math.random() * 1000),
      commentId = 'comment-1',
      userId = 'user-1'
    } = payload

    const query = {
      text: 'INSERT INTO thread_comment_likes (id, comment, owner) VALUES($1, $2, $3) RETURNING id',
      values: [id, commentId, userId]
    }

    const result = await pool.query(query)
    return result.rows[0].id
  },

  async cleanTable () {
    await pool.query('DELETE FROM thread_comment_likes')
  }
}

module.exports = ThreadCommentLikesTableTestHelper
