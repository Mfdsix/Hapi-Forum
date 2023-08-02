const ReplyThreadComment = require('../../../Domains/thread-comments/entities/ReplyThreadComment')

class ReplyThreadCommentUseCase {
  constructor ({ threadCommentRepository, threadRepository }) {
    this._threadCommentRepository = threadCommentRepository
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const payload = new ReplyThreadComment(useCasePayload)

    await this._threadRepository.checkAvailability(payload.threadId)
    await this._threadCommentRepository.checkAvailability(payload.parentId)
    return this._threadCommentRepository.reply(payload)
  }
}

module.exports = ReplyThreadCommentUseCase
