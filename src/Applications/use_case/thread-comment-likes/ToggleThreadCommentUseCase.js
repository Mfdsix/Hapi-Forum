const ToggleThreadCommentLike = require("../../../Domains/thread-comment-likes/entities/ToggleThreadCommentLike")

class ToggleThreadCommentLikeUseCase {
  constructor ({ threadCommentLikeRepository, threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository
    this._threadCommentRepository = threadCommentRepository
    this._threadCommentLikeRepository = threadCommentLikeRepository
  }

  async execute (useCasePayload) {
    const payload = new ToggleThreadCommentLike(useCasePayload)

    await this._threadRepository.checkAvailability(payload.threadId)
    await this._threadCommentRepository.checkAvailability(payload.commentId)

    return this._threadCommentLikeRepository.toggleLike(payload)
  }
}

module.exports = ToggleThreadCommentLikeUseCase
