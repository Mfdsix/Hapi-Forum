const DeleteThreadComment = require('../../../Domains/thread-comments/entities/DeleteThreadComment')

class DeleteThreadCommentUseCase {
  constructor ({ threadCommentRepository }) {
    this._threadCommentRepository = threadCommentRepository
  }

  async execute (useCasePayload) {
    const payload = new DeleteThreadComment(useCasePayload)
    await this._threadCommentRepository.checkAvailability(payload.id)
    await this._threadCommentRepository.checkAccess({
      commentId: payload.id,
      userId: payload.userId
    })
    return this._threadCommentRepository.deleteById(payload)
  }
}

module.exports = DeleteThreadCommentUseCase
