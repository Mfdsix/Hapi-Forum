const ThreadCommentLikesTableTestHelper = require('../../../../tests/ThreadCommentLikesTableTestHelper')
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

const pool = require('../../database/postgres/pool')
const ThreadCommentLikeRepositoryPostgres = require('../ThreadCommentLikeRepositoryPostgres')

describe('ThreadCommentLikeRepositoryPostgres', () => {
  let userId, commentId

  beforeEach(async () => {
    await ThreadCommentLikesTableTestHelper.cleanTable()
    await ThreadCommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()

    const { id: userid } = await UsersTableTestHelper.addUser()
    const { id: threadid } = await ThreadsTableTestHelper.seed(userid)

    commentId = await ThreadCommentsTableTestHelper.seed({
      threadId: threadid,
      userId: userid
    })

    userId = userid
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('countByCommentId function', () => {
    it('should return 0 when no likes found', async () => {
      // Arrange
      const repository = new ThreadCommentLikeRepositoryPostgres(pool, {})

      // Action & Assert
      const likes = await repository.countByCommentId('comment-1')

      expect(likes).toEqual(0)
    })

    it('should return right numer of likes', async () => {
      const likeCount = 3
      const payload = {
        commentId,
        userId
      }

      // Arrange
      const repository = new ThreadCommentLikeRepositoryPostgres(pool, {})
      for (let i = 0; i < likeCount; i++) {
        await ThreadCommentLikesTableTestHelper.seed(payload)
      }

      // Action & Assert
      const likes = await repository.countByCommentId(payload.commentId)

      expect(likes).toEqual(likeCount)
    })
  })

  describe('checkExists function', () => {
    it('should return false when not exists', async () => {
      const payload = {
        commentId,
        userId
      }

      // Arrange
      const repository = new ThreadCommentLikeRepositoryPostgres(pool, {})
      await ThreadCommentLikesTableTestHelper.seed(payload)

      // Action & Assert
      const check = await repository.checkExists(payload)

      expect(check).toBeTruthy()
    })
  })

  describe('likeComment function', () => {
    it('should like comment successfully', async () => {
      const payload = {
        commentId,
        userId
      }

      // Arrange
      const repository = new ThreadCommentLikeRepositoryPostgres(pool, () => '123')

      // Action & Assert
      const like = await repository.likeComment(payload)

      expect(like).toEqual('like-123')
    })
  })

  describe('unlikeComment function', () => {
    it('should unlike comment successfully', async () => {
      const payload = {
        id: 'like-123',
        commentId,
        userId
      }

      // Arrange
      const repository = new ThreadCommentLikeRepositoryPostgres(pool, () => '123')
      await ThreadCommentLikesTableTestHelper.seed(payload)

      // Action & Assert
      const unlike = await repository.unlikeComment(payload)

      expect(unlike).toEqual('like-123')
    })
  })

  describe('toggleLike function', () => {
    it('should like comment successfully', async () => {
      const payload = {
        commentId,
        userId
      }

      // Arrange
      const repository = new ThreadCommentLikeRepositoryPostgres(pool, () => '123')

      // Action & Assert
      const like = await repository.toggleLike(payload)

      expect(like).toEqual('like-123')
    })

    it('should unlike comment successfully', async () => {
      const payload = {
        id: 'like-123',
        commentId: 'comment-1',
        userId: 'user-1'
      }

      // Arrange
      const repository = new ThreadCommentLikeRepositoryPostgres(pool, () => '123')
      await ThreadCommentLikesTableTestHelper.seed(payload)

      // Action & Assert
      const unlike = await repository.toggleLike(payload)

      expect(unlike).toEqual('like-123')
    })
  })
})
