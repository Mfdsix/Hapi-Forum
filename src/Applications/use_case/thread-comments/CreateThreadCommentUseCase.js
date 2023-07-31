const CreateThreadComment = require('../../../Domains/thread-comments/entities/CreateThreadComment')

class CreateThreadCommentUseCase {
  constructor ({ threadCommentRepository, threadRepository }) {
    this._threadCommentRepository = threadCommentRepository
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const payload = new CreateThreadComment(useCasePayload)

    await this._threadRepository.getById(payload.threadId)
    return this._threadCommentRepository.create(payload)
  }
}

module.exports = CreateThreadCommentUseCase
