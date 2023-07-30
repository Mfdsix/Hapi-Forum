const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const CreateThread = require('../../../Domains/threads/entities/CreateThread')
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
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
      await ThreadsTableTestHelper.seed({ id: 'thread-123' })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      const threads = await threadRepositoryPostgres.getAll()

      expect(threads.length).toEqual(1)
      expect(threads[0]).toHaveProperty('id')
      expect(threads[0]).toHaveProperty('title')
      expect(threads[0]).toHaveProperty('owner')
      expect(threads[0].id).toEqual('thread-123')
    })
  })

  describe('getById function', () => {
    it('should throw error when no thread found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      const threads = threadRepositoryPostgres.getById('unique-id')

      await expect(threads).rejects.toThrow(new InvariantError('thread tidak ditemukan'))
    })

    it('should throw data when found', async () => {
      // Arrange
      await ThreadsTableTestHelper.seed({ id: 'thread-123' })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      const thread = await threadRepositoryPostgres.getById('thread-123')

      expect(thread).toHaveProperty('id')
      expect(thread).toHaveProperty('title')
      expect(thread).toHaveProperty('owner')
      expect(thread.id).toEqual('thread-123')
    })
  })

  describe('create function', () => {
    it('should persist create thread and return created thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'test',
        body: 'body of test',
        owner: 'owner-1'
      })
      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const created = await threadRepositoryPostgres.create(createThread)

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
    })
  })

  describe('updateById function', () => {
    it('should throw error when no thread found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      const threads = threadRepositoryPostgres.updateById('unique-id', {
        title: 'test',
        body: 'body of test'
      })

      await expect(threads).rejects.toThrow(new InvariantError('thread tidak ditemukan'))
    })

    it('should update thread by id correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.seed({ id: 'thread-123' })
      const updateThread = {
        title: 'updated test',
        body: 'updated body of test'
      }
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const updated = await threadRepositoryPostgres.updateById('thread-123', updateThread)
      const getOne = await threadRepositoryPostgres.getById('thread-123')

      // Assert
      expect(updated).toEqual('thread-123')
      expect(getOne.title).toEqual(updateThread.title)
      expect(getOne.body).toEqual(updateThread.body)
    })
  })

  describe('deleteById function', () => {
    it('should throw error when no thread found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      const threads = threadRepositoryPostgres.deleteById('unique-id')

      await expect(threads).rejects.toThrow(new InvariantError('thread tidak ditemukan'))
    })

    it('should delete thread by id correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.seed({ id: 'thread-123' })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const deleted = await threadRepositoryPostgres.deleteById('thread-123')
      const getOne = threadRepositoryPostgres.getById('thread-123')

      // Assert
      expect(deleted).toEqual('thread-123')
      await expect(getOne).rejects.toThrow(new InvariantError('thread tidak ditemukan'))
    })
  })
})
