const DeleteThread = require('../DeleteThread')

describe('a DeleteThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      key: 'value'
    }

    // Action and Assert
    expect(() => new DeleteThread(payload)).toThrowError('DELETE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: [],
      userId: {}
    }

    // Action and Assert
    expect(() => new DeleteThread(payload)).toThrowError('DELETE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create DeleteThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      userId: 'user-1'
    }

    // Action
    const { id, userId } = new DeleteThread(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(userId).toEqual(payload.userId)
  })
})
