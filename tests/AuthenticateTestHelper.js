const createServer = require('../src/Infrastructures/http/createServer')
const container = require('../src/Infrastructures/container')

const AuthenticateTestHelper = {
  async createUserAndLogin (username = 'user') {
    const server = await createServer(container)

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: username,
        password: 'user123',
        fullname: 'User Testing'
      }
    })
    // login user
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: username,
        password: 'user123'
      }
    })
    return JSON.parse(loginResponse.payload).data
  }
}

module.exports = AuthenticateTestHelper
