class UpdateThreadComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, content, userId } = payload

    this.id = id
    this.content = content
    this.userId = userId
  }

  _verifyPayload ({ id, content, userId }) {
    if (!id || !content || !userId) {
      throw new Error('UPDATE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof userId !== 'string') {
      throw new Error('UPDATE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    if (content.length > 250) {
      throw new Error('UPDATE_THREAD_COMMENT.CONTENT_LIMIT_CHAR')
    }
  }
}

module.exports = UpdateThreadComment
