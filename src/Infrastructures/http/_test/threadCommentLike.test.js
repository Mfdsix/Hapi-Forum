const pool = require('../../database/postgres/pool')

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const ThreadCommentLikesTableTestHelper = require('../../../../tests/ThreadCommentLikesTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

const container = require('../../container')
const createServer = require('../createServer')
const AuthenticateTestHelper = require('../../../../tests/AuthenticateTestHelper')

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  let userId, threadId, commentId

  afterAll(async () => {
    await pool.end()
  })

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
    threadId = threadid
  })

  describe('when PUT', () => {
    it('not login should response 401', async () => {
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/1/comments/2/likes'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
    })

    it('not found should response 404', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/1/comments/2/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('not found comments should response 404', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/2/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should like comment perfectly', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const server = await createServer(container)

      // Actioon
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should unlike comment perfectly', async () => {
      const { accessToken } = await AuthenticateTestHelper.createUserAndLogin()
      const server = await createServer(container)
      await ThreadCommentLikesTableTestHelper.seed({
        commentId,
        userId
      })

      // Actioon
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
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
