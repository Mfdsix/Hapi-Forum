const DeleteThreadComment = require('../DeleteThreadComment')

describe('a DeleteThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      key: 'value'
    }

    // Action and Assert
    expect(() => new DeleteThreadComment(payload)).toThrowError('DELETE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      userId: {}
    }

    // Action and Assert
    expect(() => new DeleteThreadComment(payload)).toThrowError('DELETE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create DeleteThreadComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-1',
      userId: 'user-1'
    }

    // Action
    const { id, userId } = new DeleteThreadComment(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(userId).toEqual(payload.userId)
  })
})
