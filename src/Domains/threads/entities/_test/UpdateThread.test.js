const UpdateThread = require('../UpdateThread')

describe('a UpdateThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      key: 'value'
    }

    // Action and Assert
    expect(() => new UpdateThread(payload)).toThrowError('UPDATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: [],
      title: 123,
      body: true,
      userId: {}
    }

    // Action and Assert
    expect(() => new UpdateThread(payload)).toThrowError('UPDATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when title contains more than 50 character', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      body: 'Dicoding Indonesia',
      userId: 'user-1'
    }

    // Action and Assert
    expect(() => new UpdateThread(payload)).toThrowError('UPDATE_THREAD.TITLE_LIMIT_CHAR')
  })

  it('should throw error when title contains restricted character', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dico ding &64256?',
      body: 'dicoding',
      userId: 'user-1'
    }

    // Action and Assert
    expect(() => new UpdateThread(payload)).toThrowError('UPDATE_THREAD.TITLE_CONTAIN_RESTRICTED_CHARACTER')
  })

  it('should create UpdateThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      userId: 'user-1'
    }

    // Action
    const { title, body } = new UpdateThread(payload)

    // Assert
    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)
  })

  it('should create UpdateThread object correctly with allowed title chars', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dicoding123 !? .,',
      body: 'Dicoding Indonesia',
      userId: 'user-1'
    }

    // Action
    const { title, body } = new UpdateThread(payload)

    // Assert
    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)
  })
})
