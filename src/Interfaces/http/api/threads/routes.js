const prefix = '/threads'
const options = {
  auth: 'forumapp_jwt'
}

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
    handler: handler.postHandler,
    options
  },
  {
    method: 'PUT',
    path: `${prefix}/{id}`,
    handler: handler.putByIdHandler,
    options
  },
  {
    method: 'DELETE',
    path: `${prefix}/{id}`,
    handler: handler.deleteByIdHandler,
    options
  }
])

module.exports = routes
