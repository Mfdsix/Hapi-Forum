const prefix = '/threads'

const routes = (handler) => ([
  {
    method: 'GET',
    path: prefix,
    handler: handler.getAllHandler
  },
  {
    method: 'GET',
    path: `${prefix}/{id}`,
    handler: handler.getByIdHandler
  },
  {
    method: 'POST',
    path: prefix,
    handler: handler.postHandler
  },
  {
    method: 'PUT',
    path: `${prefix}/{id}`,
    handler: handler.putByIdHandler
  },
  {
    method: 'DELETE',
    path: `${prefix}/{id}`,
    handler: handler.deleteByIdHandler
  }
])

module.exports = routes
