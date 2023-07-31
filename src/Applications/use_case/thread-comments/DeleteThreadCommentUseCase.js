const DeleteThreadComment = require('../../../Domains/thread-comments/entities/DeleteThreadComment')

class DeleteThreadCommentUseCase {
  constructor ({ threadCommentRepository }) {
    this._threadCommentRepository = threadCommentRepository
  }

  async execute (useCasePayload) {
    const payload = new DeleteThreadComment(useCasePayload)
    return this._threadCommentRepository.deleteById(payload)
  }
}

module.exports = DeleteThreadCommentUseCase
