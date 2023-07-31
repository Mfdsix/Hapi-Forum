const ReplyThreadComment = require('../../../Domains/thread-comments/entities/ReplyThreadComment')

class ReplyThreadCommentUseCase {
  constructor ({ threadCommentRepository, threadRepository }) {
    this._threadCommentRepository = threadCommentRepository
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const payload = new ReplyThreadComment(useCasePayload)

    await this._threadRepository.getById(payload.threadId)
    await this._threadCommentRepository.getById(payload.parentId)
    return this._threadCommentRepository.reply(payload)
  }
}

module.exports = ReplyThreadCommentUseCase
