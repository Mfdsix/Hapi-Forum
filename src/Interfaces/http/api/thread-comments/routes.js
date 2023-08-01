const prefix = '/threads/{threadId}/comments'
const options = {
  auth: 'forumapp_jwt'
}

const routes = (handler) => ([
  {
    method: 'POST',
    path: prefix,
    handler: handler.postCreateHandler,
    options
  },
  {
    method: 'DELETE',
    path: `${prefix}/{commentId}`,
    handler: handler.deleteHandler,
    options
  },
  {
    method: 'POST',
    path: `${prefix}/{commentId}/replies`,
    handler: handler.postReplyHandler,
    options
  },
  {
    method: 'DELETE',
    path: `${prefix}/{commentId}/replies/{replyId}`,
    handler: handler.deleteHandler,
    options
  }
])

module.exports = routes
