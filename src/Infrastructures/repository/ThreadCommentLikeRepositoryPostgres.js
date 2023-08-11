const ThreadCommentLikeRepository = require('../../Domains/thread-comment-likes/ThreadCommentLikeRepository')

class ThreadCommentLikeRepositoryPostgres extends ThreadCommentLikeRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async countByCommentId (commentId) {
    const query = {
      text: `
      SELECT COUNT(id) as count FROM thread_comment_likes
      WHERE comment = $1
      `,
      values: [commentId]
    }
    const result = await this._pool.query(query)

    if (result.rows.length < 1) return 0

    return parseInt(result.rows[0].count) ?? 0
  }

  async toggleLike ({
    commentId,
    userId
  }) {
    const isExist = await this.checkExists({
      commentId,
      userId
    })

    if (isExist) {
      return this.unlikeComment({
        commentId,
        userId
      })
    }

    return this.likeComment({
      commentId,
      userId
    })
  }

  async checkExists ({
    commentId,
    userId
  }) {
    const query = {
      text: `
        SELECT id FROM thread_comment_likes
        WHERE comment = $1 AND owner = $2
        `,
      values: [commentId, userId]
    }
    const result = await this._pool.query(query)

    return result.rows.length > 0
  }

  async likeComment ({
    commentId,
    userId
  }) {
    const id = `like-${this._idGenerator()}`
    const query = {
      text: `
        INSERT INTO thread_comment_likes (id, comment, owner) VALUES ($1, $2, $3) RETURNING id
        `,
      values: [id, commentId, userId]
    }
    const result = await this._pool.query(query)

    return result.rows[0].id
  }

  async unlikeComment ({
    commentId,
    userId
  }) {
    const query = {
      text: `
          DELETE FROM thread_comment_likes
          WHERE comment = $1 AND owner = $2
          RETURNING id
          `,
      values: [commentId, userId]
    }
    const result = await this._pool.query(query)

    return result.rows[0].id
  }
}

module.exports = ThreadCommentLikeRepositoryPostgres
