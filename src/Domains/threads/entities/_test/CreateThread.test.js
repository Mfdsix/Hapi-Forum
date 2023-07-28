const CreateThread = require('../CreateThread')

describe('a CreateThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      key: 'value'
    }

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true
    }

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when title contains more than 50 character', () => {
    // Arrange
    const payload = {
      title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      body: 'Dicoding Indonesia'
    }

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.TITLE_LIMIT_CHAR')
  })

  it('should throw error when title contains restricted character', () => {
    // Arrange
    const payload = {
      title: 'dico ding &64256?',
      body: 'dicoding'
    }

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.TITLE_CONTAIN_RESTRICTED_CHARACTER')
  })

  it('should create createThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'dicoding',
      body: 'Dicoding Indonesia'
    }

    // Action
    const { title, body } = new CreateThread(payload)

    // Assert
    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)
  })

  it('should create createThread object correctly with allowed title chars', () => {
    // Arrange
    const payload = {
      title: 'dicoding123 !? .,',
      body: 'Dicoding Indonesia'
    }

    // Action
    const { title, body } = new CreateThread(payload)

    // Assert
    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)
  })
})
