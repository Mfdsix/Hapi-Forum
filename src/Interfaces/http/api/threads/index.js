const Handlers = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'threads',
  register: async (server, { container }) => {
    const handlers = new Handlers(container)
    server.route(routes(handlers))
  }
}
