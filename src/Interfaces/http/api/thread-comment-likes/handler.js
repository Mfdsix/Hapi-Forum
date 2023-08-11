const HttpResponse = require('../../../../Commons/HttpResponse')
const autoBind = require('auto-bind')

class ThreadCommentLikesHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async putLikeHandler (request) {
    const { threadId, commentId } = request.params
    const { id: credentialId } = request.auth.credentials

    const useCase = this._container.getInstance(ToggleThreadCommentLikeUseCase.name)
    await useCase.execute({
      threadId,
      commentId,
      userId: credentialId
    })

    return HttpResponse.success()
  }
}

module.exports = ThreadCommentLikesHandler
