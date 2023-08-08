const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const CreateThread = require('../../../Domains/threads/entities/CreateThread')
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
  let userId, userName

  beforeEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()

    const { id, username } = await UsersTableTestHelper.addUser()
    userId = id
    userName = username
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('getAll function', () => {
    it('should throw empty array when no thread datas', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      const threads = await threadRepositoryPostgres.getAll()

      expect(threads.length).toEqual(0)
      expect(threads).toEqual([])
    })

    it('should throw data when found', async () => {
      // Arrange
      const { id } = await ThreadsTableTestHelper.seed(userId)
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      const threads = await threadRepositoryPostgres.getAll()

      expect(threads.length).toEqual(1)
      expect(threads[0]).toHaveProperty('id')
      expect(threads[0]).toHaveProperty('title')
      expect(threads[0]).toHaveProperty('owner')
      expect(threads[0].id).toEqual(id)
      expect(threads[0].title).toEqual('test')
      expect(threads[0].owner).toEqual(userId)
    })
  })

  describe('getById function', () => {
    it('should throw data when found', async () => {
      // Arrange
      await ThreadsTableTestHelper.seed(userId)
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      const thread = await threadRepositoryPostgres.getById('thread-123')

      expect(thread).toHaveProperty('id')
      expect(thread).toHaveProperty('title')
      expect(thread).toHaveProperty('body')
      expect(thread).toHaveProperty('owner')
      expect(thread).toHaveProperty('username')
      expect(thread).toHaveProperty('created_at')
      expect(thread.id).toEqual('thread-123')
      expect(thread.title).toEqual('test')
      expect(thread.body).toEqual('body of test')
      expect(thread.owner).toEqual(userId)
      expect(thread.username).toEqual(userName)
      expect(thread.created_at).toBeTruthy()
    })
  })

  describe('checkAvailability function', () => {
    it('should throw 404 when not found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      const comment = threadCommentRepositoryPostgres.checkAvailability('thread-1')

      await (expect(comment)).rejects.toThrow(new NotFoundError('thread tidak ditemukan'))
    })

    it('should resolves when found', async () => {
      // Arrange
      await ThreadsTableTestHelper.seed(userId)
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      const thread = threadRepositoryPostgres.checkAvailability('thread-123')

      await (expect(thread)).resolves.not.toThrowError()
    })
  })

  describe('checkAccess function', () => {
    it('should throw 403 when not owner', async () => {
      // Arrange
      await ThreadsTableTestHelper.seed(userId)
      const threadCommentRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      const comment = threadCommentRepositoryPostgres.checkAccess({
        threadId: 'thread-1',
        userId: 'user-random'
      })

      await (expect(comment)).rejects.toThrow(new AuthorizationError('tidak dapat mengakses thread'))
    })

    it('should resolves when access by owner', async () => {
      // Arrange
      await ThreadsTableTestHelper.seed(userId)
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      const thread = threadRepositoryPostgres.checkAccess({
        threadId: 'thread-123',
        userId
      })

      await (expect(thread)).resolves.not.toThrowError()
    })
  })

  describe('create function', () => {
    it('should persist create thread and return created thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'test',
        body: 'body of test',
        owner: userId
      })
      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const created = await threadRepositoryPostgres.create(createThread)
      const getOne = await threadRepositoryPostgres.getById('thread-123')

      // Assert
      expect(created).toEqual(new CreatedThread({
        id: 'thread-123',
        title: createThread.title,
        owner: createThread.owner
      }))
      expect(created).toHaveProperty('id')
      expect(created).toHaveProperty('title')
      expect(created).toHaveProperty('owner')
      expect(created.id).toEqual('thread-123')
      expect(created.title).toEqual(createThread.title)
      expect(created.owner).toEqual(createThread.owner)
      expect(getOne.id).toEqual(created.id)
      expect(getOne.title).toEqual(created.title)
      expect(getOne.body).toEqual(createThread.body)
      expect(getOne.owner).toEqual(created.owner)
      expect(getOne.created_at).toBeTruthy()
    })
  })

  describe('updateById function', () => {
    it('should update thread by id correctly', async () => {
      // Arrange
      const { id } = await ThreadsTableTestHelper.seed(userId)
      const updateThread = {
        id,
        title: 'updated test',
        body: 'updated body of test',
        userId
      }
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const updated = await threadRepositoryPostgres.updateById(updateThread)
      const getOne = await threadRepositoryPostgres.getById(id)

      // Assert
      expect(updated).toEqual(id)
      expect(getOne.title).toEqual(updateThread.title)
      expect(getOne.body).toEqual(updateThread.body)
    })
  })

  describe('deleteById function', () => {
    it('should delete thread by id correctly', async () => {
      // Arrange
      const { id } = await ThreadsTableTestHelper.seed(userId)
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const deleted = await threadRepositoryPostgres.deleteById({
        id,
        userId
      })
      const check = threadRepositoryPostgres.checkAvailability('thread-123')

      // Assert
      expect(deleted).toEqual('thread-123')
      await expect(check).rejects.toThrow(new NotFoundError('thread tidak ditemukan'))
    })
  })
})
