class CreateThreadComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { content, owner, threadId } = payload

    this.threadId = threadId
    this.content = content
    this.owner = owner
  }

  _verifyPayload ({ threadId, content, owner }) {
    if (!threadId || !content || !owner) {
      throw new Error('CREATE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof threadId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('CREATE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    if (content.length > 250) {
      throw new Error('CREATE_THREAD_COMMENT.CONTENT_LIMIT_CHAR')
    }
  }
}

module.exports = CreateThreadComment
