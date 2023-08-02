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

      comments[i] = this._transformComment(comments[i])
      comments[i].replies = replies.map(this._transformComment)
    }

    return {
      ...thread,
      comments
    }
  }

  _transformComment (comment) {
    let content = comment.content
    if (comment.deleted_at) {
      if (comment.parent) {
        content = '**balasan telah dihapus**'
      } else {
        content = '**komentar telah dihapus**'
      }
    }

    return {
      id: comment.id,
      content,
      username: comment.username,
      date: comment.created_at
    }
  }
}

module.exports = GetByIdThreadUseCase
