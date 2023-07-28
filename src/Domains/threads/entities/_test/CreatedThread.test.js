const CreatedThread = require('../CreatedThread')

describe('a CreatedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      key: 'value'
    }

    // Action and Assert
    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: true,
      owner: []
    }

    // Action and Assert
    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create createdThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'id-123',
      title: 'Dicoding Indonesia',
      owner: 'me'
    }

    // Action
    const { id, body, owner } = new CreatedThread(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(body).toEqual(payload.body)
    expect(owner).toEqual(payload.owner)
  })
})
