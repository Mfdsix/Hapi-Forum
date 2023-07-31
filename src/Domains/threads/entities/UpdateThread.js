class UpdateThread {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, title, body, userId } = payload

    this.id = id
    this.title = title
    this.body = body
    this.userId = userId
  }

  _verifyPayload ({ id, title, body, userId }) {
    if (!id || !title || !body || !userId) {
      throw new Error('UPDATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof userId !== 'string') {
      throw new Error('UPDATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    if (title.length > 50) {
      throw new Error('UPDATE_THREAD.TITLE_LIMIT_CHAR')
    }

    if (!title.match(/^[\w !?.,]+$/)) {
      throw new Error('UPDATE_THREAD.TITLE_CONTAIN_RESTRICTED_CHARACTER')
    }
  }
}

module.exports = UpdateThread
