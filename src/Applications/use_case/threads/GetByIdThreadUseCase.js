class GetByIdThreadUseCase {
  constructor ({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository
    this._threadCommentRepository = threadCommentRepository
  }

  async execute (useCasePayload) {
    const thread = await this._threadRepository.getById(useCasePayload)
    const comments = await this._threadCommentRepository.getByThreadId(thread.id)

    for (let i = 0; i < comments.length; i++) {
      const replies = await this._threadCommentRepository.getReplyByCommentId(comments[i].id)

      comments[i].replies = replies
    }

    return {
      ...thread,
      comments
    }
  }
}

module.exports = GetByIdThreadUseCase
