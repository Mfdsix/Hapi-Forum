const UpdateThreadComment = require('../../../Domains/thread-comments/entities/UpdateThreadComment')

class UpdateThreadCommentUseCase {
  constructor ({ threadCommentRepository }) {
    this._threadCommentRepository = threadCommentRepository
  }

  async execute (useCasePayload) {
    const payload = new UpdateThreadComment(useCasePayload)
    await this._threadCommentRepository.checkAvailability(payload.id)
    await this._threadCommentRepository.checkAccess({
      commentId: payload.id,
      userId: payload.userId
    })
    return this._threadCommentRepository.updateById(payload)
  }
}

module.exports = UpdateThreadCommentUseCase
