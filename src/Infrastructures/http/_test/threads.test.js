const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticateTestHelper = require('../../../../tests/AuthenticateTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  beforeEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
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
      expect(response.statusCode).toEqual(404)
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

  describe('when POST /threads', () => {
    it('should response 401 when not login', async () => {
      const payload = {
        title: 'title',
        body: 'body of title'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
    })

    it('should response 400 when invalid body', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const payload = {
        title: true,
        body: {}
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        method: 'POST',
        url: '/threads',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 201 when valid body', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const payload = {
        title: 'title',
        body: 'body of title'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        method: 'POST',
        url: '/threads',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
    })
  })

  describe('when PUT /threads/{id}', () => {
    it('should response 401 when not login', async () => {
      const payload = {
        title: 'title',
        body: 'body of title'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/1',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
    })

    it('should response 400 when invalid body', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const payload = {
        title: true,
        body: {}
      }
      const server = await createServer(container)
      // Action
      const response = await server.inject({
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        method: 'PUT',
        url: '/threads/1',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 404 when no data', async () => {
      const payload = {
        title: 'title',
        body: 'body of title'
      }
      const server = await createServer(container)
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/1',
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 403 when not owner', async () => {
      const payload = {
        title: 'title',
        body: 'body of title'
      }
      const server = await createServer(container)
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()

      // Action
      const {id:threadId} = await ThreadsTableTestHelper.seed()
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}`,
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 200 when not owner', async () => {
      const payload = {
        title: 'title',
        body: 'body of title'
      }
      const server = await createServer(container)
      const { accessToken, userId } = await AuthenticateTestHelper.createUserAndLogin()

      // Action
      const {id: threadId} = await ThreadsTableTestHelper.seed(userId)
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}`,
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })

  describe('when DELETE /threads/{id}', () => {
    it('should response 401 when not login', async () => {
      const threadId = 'thread-1'
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
    })

    it('should response 404 when not no data', async () => {
      const server = await createServer(container)
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const threadId = 'thread-1'

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}`,
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 403 when not owner', async () => {
      const server = await createServer(container)
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()

      // Action
      const {id:threadId} = await ThreadsTableTestHelper.seed()
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}`,
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 200 when ok', async () => {
      const server = await createServer(container)
      const { accessToken, userId } = await AuthenticateTestHelper.createUserAndLogin()

      // Action
      const { id: threadId } = await ThreadsTableTestHelper.seed(userId)
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}`,
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
