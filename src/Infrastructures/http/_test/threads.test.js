const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
  })

  describe('when GET /threads', () => {
    it('should response 200 with empty threads when no thread data', async () => {
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.threads).toEqual([])
    })

    it('should response 200 with thread datas', async () => {
      await ThreadsTableTestHelper.seed()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.threads.length).toEqual(1)
      expect(responseJson.data.threads[0]).toHaveProperty('id')
      expect(responseJson.data.threads[0]).toHaveProperty('title')
      expect(responseJson.data.threads[0]).toHaveProperty('owner')
      expect(responseJson.data.threads[0].id).toEqual('thread-123')
    })
  })

  describe('when GET /threads/{id}', () => {
    it('should response 404 when thread not found', async () => {
      const server = await createServer(container)
      const threadId = 'thread-123'

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 200 when thread found', async () => {
      await ThreadsTableTestHelper.seed()
      const server = await createServer(container)
      const threadId = 'thread-123'

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toHaveProperty('id')
      expect(responseJson.data.thread).toHaveProperty('title')
      expect(responseJson.data.thread.id).toEqual(threadId)
    })
  })
})
