const createServer = require('../src/Infrastructures/http/createServer')
const container = require('../src/Infrastructures/container')

const AuthenticateTestHelper = {
  async createUserAndLogin (username = 'user') {
    const server = await createServer(container)

    // add user
    const register = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: username,
        password: 'user123',
        fullname: 'User Testing'
      }
    })
    // login user
    const login = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: username,
        password: 'user123'
      }
    })

    const registerResponse = JSON.parse(register.payload).data
    const loginResponse = JSON.parse(login.payload).data

    return {
      userId: registerResponse.addedUser.id,
      ...loginResponse
    }
  }
}

module.exports = AuthenticateTestHelper
