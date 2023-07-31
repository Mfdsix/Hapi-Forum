const UpdateThreadComment = require('../../../Domains/thread-comments/entities/UpdateThreadComment')

class UpdateThreadCommentUseCase {
  constructor ({ threadCommentRepository }) {
    this._threadCommentRepository = threadCommentRepository
  }

  async execute (useCasePayload) {
    const payload = new UpdateThreadComment(useCasePayload)
    return this._threadCommentRepository.updateById(payload)
  }
}

module.exports = UpdateThreadCommentUseCase
