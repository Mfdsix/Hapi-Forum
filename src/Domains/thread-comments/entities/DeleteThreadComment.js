class DeleteThreadComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, userId } = payload

    this.id = id
    this.userId = userId
  }

  _verifyPayload ({ id, userId }) {
    if (!id || !userId) {
      throw new Error('DELETE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof userId !== 'string') {
      throw new Error('DELETE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DeleteThreadComment
