const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres')

const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

const CreateThreadComment = require('../../../Domains/thread-comments/entities/CreateThreadComment')
const CreatedThreadComment = require('../../../Domains/thread-comments/entities/CreatedThreadComment')
const ReplyThreadComment = require('../../../Domains/thread-comments/entities/ReplyThreadComment')

const pool = require('../../database/postgres/pool')

describe('ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('getByThreadId function', () => {
    it('should throw empty array when no comment datas', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const comments = await threadCommentRepositoryPostgres.getByThreadId('thread-1')

      expect(comments.length).toEqual(0)
      expect(comments).toEqual([])
    })

    it('should throw data when found', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.seed()
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const comments = await threadCommentRepositoryPostgres.getByThreadId('thread-1')

      expect(comments.length).toEqual(1)
      expect(comments[0]).toHaveProperty('id')
      expect(comments[0]).toHaveProperty('content')
      expect(comments[0]).toHaveProperty('username')
      expect(comments[0]).toHaveProperty('date')
      expect(comments[0].id).toEqual('comment-1')
      expect(comments[0].content).toEqual('test')
    })
  })

  describe('getReplyByCommentId function', () => {
    it('should throw empty array when no comment datas', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const comments = await threadCommentRepositoryPostgres.getReplyByCommentId('comment-1')

      expect(comments.length).toEqual(0)
      expect(comments).toEqual([])
    })

    it('should throw data when found', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.reply()
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const comments = await threadCommentRepositoryPostgres.getReplyByCommentId('comment-1')

      expect(comments.length).toEqual(1)
      expect(comments[0]).toHaveProperty('id')
      expect(comments[0]).toHaveProperty('content')
      expect(comments[0]).toHaveProperty('username')
      expect(comments[0]).toHaveProperty('date')
      expect(comments[0].id).toEqual('comment-2')
      expect(comments[0].content).toEqual('comment test reply')
    })
  })

  describe('getById function', () => {
    it('should throw error when no comment found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const comment = threadCommentRepositoryPostgres.getById('unique-id')

      await expect(comment).rejects.toThrow(new NotFoundError('komentar tidak ditemukan'))
    })

    it('should throw data when found', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.seed()
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const comment = await threadCommentRepositoryPostgres.getById('comment-1')

      expect(comment).toHaveProperty('id')
      expect(comment).toHaveProperty('content')
      expect(comment).toHaveProperty('username')
      expect(comment.id).toEqual('comment-1')
      expect(comment.content).toEqual('test')
    })
  })

  describe('create function', () => {
    it('should persist create comment and return created comment correctly', async () => {
      // Arrange
      const payload = new CreateThreadComment({
        threadId: 'thread-1',
        content: 'body of comment',
        owner: 'owner-1'
      })
      const fakeIdGenerator = () => '123' // stub!
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const created = await threadCommentRepositoryPostgres.create(payload)
      const getOne = await threadCommentRepositoryPostgres.getById('comment-123')

      // Assert
      expect(created).toEqual(new CreatedThreadComment({
        id: 'comment-123',
        content: payload.content,
        owner: payload.owner
      }))
      expect(created).toHaveProperty('id')
      expect(created).toHaveProperty('content')
      expect(created).toHaveProperty('owner')
      expect(created.id).toEqual('comment-123')
      expect(getOne).toHaveProperty('id')
      expect(getOne).toHaveProperty('content')
      expect(getOne).toHaveProperty('username')
      expect(getOne).toHaveProperty('date')
      expect(getOne.id).toEqual(created.id)
      expect(getOne.content).toEqual(created.content)
    })
  })

  describe('reply function', () => {
    it('should persist reply comment and return created reply correctly', async () => {
      // Arrange
      const payload = new ReplyThreadComment({
        parentId: 'comment-1',
        threadId: 'thread-1',
        content: 'body of reply comment',
        owner: 'owner-1'
      })
      const fakeIdGenerator = () => '1234' // stub!
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const created = await threadCommentRepositoryPostgres.create(payload)

      // Assert
      expect(created).toEqual(new CreatedThreadComment({
        id: 'comment-1234',
        content: payload.content,
        owner: payload.owner
      }))
      expect(created).toHaveProperty('id')
      expect(created).toHaveProperty('content')
      expect(created).toHaveProperty('owner')
      expect(created.id).toEqual('comment-1234')
      expect(created.content).toEqual(payload.content)
      expect(created.owner).toEqual(payload.owner)
    })
  })

  describe('updateById function', () => {
    it('should throw error when no comment found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const updated = threadCommentRepositoryPostgres.updateById({
        id: 'unique-id',
        content: 'body of edited comment',
        userId: 'owner'
      })

      await expect(updated).rejects.toThrow(new NotFoundError('komentar tidak ditemukan'))
    })

    it('should throw error when not owner of comment', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.seed()
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action
      const updated = threadCommentRepositoryPostgres.updateById({
        id: 'comment-1',
        content: 'update content of comment',
        userId: 'user-random'
      })

      // Assert
      await expect(updated).rejects.toThrow(new AuthorizationError('tidak dapat mengakses komentar'))
    })

    it('should update comment by id correctly', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.seed()
      const updateThread = {
        id: 'comment-1',
        content: 'update content of comment',
        userId: 'user-1'
      }
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action
      const updated = await threadCommentRepositoryPostgres.updateById(updateThread)
      const getOne = await threadCommentRepositoryPostgres.getById('comment-1')

      // Assert
      expect(updated).toEqual('comment-1')
      expect(getOne.content).toEqual(updateThread.content)
    })
  })

  describe('deleteById function', () => {
    it('should throw error when no comment found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const comment = threadCommentRepositoryPostgres.deleteById({
        id: 'unique-id',
        userId: 'user-1'
      })

      await expect(comment).rejects.toThrow(new NotFoundError('komentar tidak ditemukan'))
    })

    it('should throw error when not owner of comment', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.seed()
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action
      const deleted = threadCommentRepositoryPostgres.deleteById({
        id: 'comment-1',
        userId: 'user-random'
      })

      // Assert
      await expect(deleted).rejects.toThrow(new AuthorizationError('tidak dapat mengakses komentar'))
    })

    it('should delete comment by id correctly', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.seed()
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action
      const deleted = await threadCommentRepositoryPostgres.deleteById({
        id: 'comment-1',
        userId: 'user-1'
      })
      const getOne = await threadCommentRepositoryPostgres.getById('comment-1')

      // Assert
      expect(deleted).toEqual('comment-1')
      expect(getOne.id).toEqual('comment-1')
      expect(getOne.content).toEqual('**komentar telah dihapus**')
    })
  })
})
