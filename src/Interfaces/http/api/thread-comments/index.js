const Handlers = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'thread-comments',
  register: async (server, { container }) => {
    const handlers = new Handlers(container)
    server.route(routes(handlers))
  }
}
