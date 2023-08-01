const CreateThreadCommentUseCase = require('../../../../Applications/use_case/thread-comments/CreateThreadCommentUseCase')
const ReplyThreadCommentUseCase = require('../../../../Applications/use_case/thread-comments/ReplyThreadCommentUseCase')
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/thread-comments/DeleteThreadCommentUseCase')

const HttpResponse = require('../../../../Commons/HttpResponse')
const autoBind = require('auto-bind')

class ThreadCommentsHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async postCreateHandler (request, h) {
    const { threadId } = request.params
    const { content } = request.payload || {}
    const { id: credentialId } = request.auth.credentials

    const useCase = this._container.getInstance(CreateThreadCommentUseCase.name)
    const addedComment = await useCase.execute({
      threadId,
      content,
      owner: credentialId
    })

    const response = h.response(HttpResponse.success({
      data: {
        addedComment
      }
    }))
    response.code(201)

    return response
  }

  async postReplyHandler (request, h) {
    const { threadId, commentId } = request.params
    const { content } = request.payload || {}
    const { id: credentialId } = request.auth.credentials

    const useCase = this._container.getInstance(ReplyThreadCommentUseCase.name)
    const addedReply = await useCase.execute({
      parentId: commentId,
      threadId,
      content,
      owner: credentialId
    })

    const response = h.response(HttpResponse.success({
      data: {
        addedReply
      }
    }))
    response.code(201)

    return response
  }

  async deleteHandler (request, h) {
    const { commentId, replyId } = request.params
    const { id: credentialId } = request.auth.credentials

    const useCase = this._container.getInstance(DeleteThreadCommentUseCase.name)
    await useCase.execute({
      id: replyId || commentId,
      userId: credentialId
    })

    const response = h.response(HttpResponse.success({
      message: 'Komentar berhasil dihapus'
    }))
    return response
  }
}

module.exports = ThreadCommentsHandler
