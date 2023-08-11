const prefix = '/threads/{threadId}/comments/{commentId}/likes'
const options = {
  auth: 'forumapp_jwt'
}

const routes = (handler) => ([
  {
    method: 'PUT',
    path: prefix,
    handler: handler.putLikeHandler,
    options
  }
])

module.exports = routes
