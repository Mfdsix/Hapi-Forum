class ReplyThreadComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { content, owner, threadId, parentId } = payload

    this.threadId = threadId
    this.content = content
    this.owner = owner
    this.parentId = parentId
  }

  _verifyPayload ({ threadId, content, owner, parentId }) {
    if (!threadId || !content || !owner || !parentId) {
      throw new Error('REPLY_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof threadId !== 'string' || typeof content !== 'string' || typeof owner !== 'string' || typeof parentId !== 'string') {
      throw new Error('REPLY_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    if (content.length > 250) {
      throw new Error('REPLY_THREAD_COMMENT.CONTENT_LIMIT_CHAR')
    }
  }
}

module.exports = ReplyThreadComment
