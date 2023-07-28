class CreateThread {
  constructor (payload) {
    this._verifyPayload(payload)

    const { title, body } = payload

    this.title = title
    this.body = body
  }

  _verifyPayload ({ title, body }) {
    if (!title || !body) {
      throw new Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    if (title.length > 50) {
      throw new Error('CREATE_THREAD.TITLE_LIMIT_CHAR')
    }

    if (!title.match(/^[\w !?.,]+$/)) {
      throw new Error('CREATE_THREAD.TITLE_CONTAIN_RESTRICTED_CHARACTER')
    }
  }
}

module.exports = CreateThread
