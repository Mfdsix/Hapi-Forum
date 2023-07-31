class UpdateThread {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, userId } = payload

    this.id = id
    this.userId = userId
  }

  _verifyPayload ({ id, userId }) {
    if (!id || !userId) {
      throw new Error('DELETE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof userId !== 'string') {
      throw new Error('DELETE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = UpdateThread
