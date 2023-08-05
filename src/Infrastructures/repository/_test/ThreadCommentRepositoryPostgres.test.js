const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres')
const CreateThreadComment = require('../../../Domains/thread-comments/entities/CreateThreadComment')
const CreatedThreadComment = require('../../../Domains/thread-comments/entities/CreatedThreadComment')
const ReplyThreadComment = require('../../../Domains/thread-comments/entities/ReplyThreadComment')

const pool = require('../../database/postgres/pool')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('ThreadCommentRepositoryPostgres', () => {
  let userId

  beforeEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()

    const { id } = await UsersTableTestHelper.addUser()
    userId = id
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
      const currDate = new Date().toISOString()
      const commentPayload = {
        id: 'comment-1',
        threadId: 'thread-1',
        content: 'test',
        userId: 'user-1',
        createdAt: currDate
      }

      // Arrange
      await ThreadCommentsTableTestHelper.seed(commentPayload)
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const comments = await threadCommentRepositoryPostgres.getByThreadId('thread-1')

      expect(comments.length).toEqual(1)
      expect(comments[0]).toHaveProperty('id')
      expect(comments[0]).toHaveProperty('content')
      expect(comments[0]).toHaveProperty('username')
      expect(comments[0]).toHaveProperty('created_at')
      expect(comments[0].id).toEqual(commentPayload.id)
      expect(comments[0].content).toEqual(commentPayload.content)
      expect(comments[0].owner).toEqual(commentPayload.userId)
      expect(comments[0].date).toEqual(commentPayload.date)
      expect(comments[0].thread).toEqual(commentPayload.threadId)
      expect(comments[0].parent).toBeFalsy()
      expect(comments[0].deleted_at).toBeFalsy()
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
      const currDate = new Date().toISOString()
      const replyPayload = {
        id: 'comment-1',
        commentId: 'comment-1',
        threadId: 'thread-1',
        content: 'test',
        userId: 'user-1',
        createdAt: currDate
      }

      // Arrange
      await ThreadCommentsTableTestHelper.reply(replyPayload)
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const comments = await threadCommentRepositoryPostgres.getReplyByCommentId('comment-1')

      expect(comments.length).toEqual(1)
      expect(comments[0]).toHaveProperty('id')
      expect(comments[0]).toHaveProperty('content')
      expect(comments[0]).toHaveProperty('username')
      expect(comments[0]).toHaveProperty('created_at')
      expect(comments[0].id).toEqual(replyPayload.id)
      expect(comments[0].content).toEqual(replyPayload.content)
      expect(comments[0].owner).toEqual(replyPayload.userId)
      expect(comments[0].date).toEqual(replyPayload.date)
      expect(comments[0].thread).toEqual(replyPayload.threadId)
      expect(comments[0].parent).toEqual(replyPayload.commentId)
      expect(comments[0].deleted_at).toBeFalsy()
    })
  })

  describe('getById function', () => {
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
      expect(comment.owner).toEqual('user-1')
    })
  })

  describe('checkAvailability function', () => {
    it('should throw 404 when not found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const comment = threadCommentRepositoryPostgres.checkAvailability('comment-1')

      await (expect(comment)).rejects.toThrow(new NotFoundError('komentar tidak ditemukan'))
    })

    it('should resolves true when found', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.seed()
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const isAvailable = threadCommentRepositoryPostgres.checkAvailability('comment-1')

      await (expect(isAvailable)).resolves
    })
  })

  describe('checkAccess function', () => {
    it('should throw 403 when not owner', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.seed()
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const comment = threadCommentRepositoryPostgres.checkAccess({
        commentId: 'comment-1',
        userId: 'user-random'
      })

      await (expect(comment)).rejects.toThrow(new AuthorizationError('tidak dapat mengakses komentar'))
    })

    it('should resolves true when found', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.seed({
        userId
      })
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action & Assert
      const isAvailable = threadCommentRepositoryPostgres.checkAccess({
        commentId: 'comment-1',
        userId
      })

      await (expect(isAvailable)).resolves
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
      expect(getOne).toHaveProperty('created_at')
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
      const created = await threadCommentRepositoryPostgres.reply(payload)
      const getOne = await threadCommentRepositoryPostgres.getById('comment-1234')

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
      expect(getOne).toHaveProperty('id')
      expect(getOne).toHaveProperty('content')
      expect(getOne).toHaveProperty('owner')
      expect(getOne.id).toEqual(created.id)
      expect(getOne.content).toEqual(created.content)
      expect(getOne.owner).toEqual(created.owner)
    })
  })

  describe('updateById function', () => {
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
      expect(getOne).toHaveProperty('deleted_at')
      expect(getOne.id).toEqual('comment-1')
      expect(getOne).toHaveProperty('deleted_at')
      expect(getOne.deleted_at).toBeTruthy()
    })
  })
})
