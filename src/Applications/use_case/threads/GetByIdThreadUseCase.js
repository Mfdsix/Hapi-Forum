class GetByIdThreadUseCase {
  constructor ({ threadRepository, threadCommentRepository, threadCommentLikeRepository }) {
    this._threadRepository = threadRepository
    this._threadCommentRepository = threadCommentRepository
    this._threadCommentLikeRepository = threadCommentLikeRepository
  }

  async execute (useCasePayload) {
    await this._threadRepository.checkAvailability(useCasePayload)
    const thread = await this._threadRepository.getById(useCasePayload)
    const comments = await this._threadCommentRepository.getByThreadId(thread.id)

    for (let i = 0; i < comments.length; i++) {
      // get comment like
      const commentLikes = await this._threadCommentLikeRepository.countByCommentId(comments[i].id)
      comments[i].likes = commentLikes

      // get comment replies
      const replies = await this._threadCommentRepository.getReplyByCommentId(comments[i].id)
      for (let ii = 0; ii < replies.length; ii++) {
        // get comment reply like
        const replyLikes = await this._threadCommentLikeRepository.countByCommentId(replies[ii].id)
        replies[ii].likes = replyLikes
      }

      comments[i] = this._transformComment(comments[i])
      comments[i].replies = replies.map(this._transformComment)
    }

    return {
      ...this._transformThread(thread),
      comments
    }
  }

  _transformThread (data) {
    return {
      id: data.id,
      title: data.title,
      body: data.body,
      username: data.username,
      date: data.created_at
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
      date: comment.created_at,
      likeCount: comment.likes ?? 0
    }
  }
}

module.exports = GetByIdThreadUseCase
