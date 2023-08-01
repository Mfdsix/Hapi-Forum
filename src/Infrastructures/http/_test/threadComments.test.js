const pool = require('../../database/postgres/pool')

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticateTestHelper = require('../../../../tests/AuthenticateTestHelper')

const container = require('../../container')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments endpoint', () => {
  let threadId

  beforeAll(async () => {
    await ThreadsTableTestHelper.cleanTable()
    threadId = await ThreadsTableTestHelper.seed()
  })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when not login', async () => {
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'my comment content'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
    })

    it('should response 400 when payload is invalid', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 201 when valid', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: {
          content: 'My comment content'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
    })
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401 when not login', async () => {
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/1/replies`,
        payload: {
          content: 'my comment content'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
    })

    it('should response 404 when parent comment not found', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/1/replies`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: {
          content: 'My comment content'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 400 when payload is invalid', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const server = await createServer(container)

      // Action
      const commentId = await ThreadCommentsTableTestHelper.seed()
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 200 when valid', async () => {
      const { accessToken, userId } = await AuthenticateTestHelper.createUserAndLogin()
      const server = await createServer(container)

      // Action
      const commentId = await ThreadCommentsTableTestHelper.seed(userId)
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: {
          content: 'My comment content'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 when not login', async () => {
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/1/replies/2`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
    })

    it('should response 404 when reply not found', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/1`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 403 when not author of comment', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin('anotheruser')
      const server = await createServer(container)

      // Action
      const commentId = await ThreadCommentsTableTestHelper.seed()
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 200 when valid', async () => {
      const { accessToken, userId } = await AuthenticateTestHelper.createUserAndLogin('user1')
      const server = await createServer(container)

      // Action
      const commentId = await ThreadCommentsTableTestHelper.seed(userId)
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 401 when not login', async () => {
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/1/replies/2`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
    })

    it('should response 404 when comment not found', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/1/replies/2`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 403 when not author of comment', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin('anotheruser')
      const server = await createServer(container)

      // Action
      const commentId = await ThreadCommentsTableTestHelper.seed()
      const replyId = await ThreadCommentsTableTestHelper.reply(commentId)
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 200 when valid', async () => {
      const { accessToken, userId } = await AuthenticateTestHelper.createUserAndLogin('user1')
      const server = await createServer(container)

      // Action
      const commentId = await ThreadCommentsTableTestHelper.seed(userId)
      const replyId = await ThreadCommentsTableTestHelper.reply(commentId, userId)
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
