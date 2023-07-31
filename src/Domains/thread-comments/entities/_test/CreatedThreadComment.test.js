const CreatedThreadComment = require('../CreatedThreadComment')

describe('a CreatedThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      key: 'value'
    }

    // Action and Assert
    expect(() => new CreatedThreadComment(payload)).toThrowError('CREATED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: true,
      owner: {}
    }

    // Action and Assert
    expect(() => new CreatedThreadComment(payload)).toThrowError('CREATED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create CreatedThreadComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-1',
      content: 'content comment',
      owner: 'user-1'
    }

    // Action
    const { id, content, owner } = new CreatedThreadComment(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
  })
})
