const UpdateThreadComment = require('../UpdateThreadComment')

describe('a UpdateThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      key: 'value'
    }

    // Action and Assert
    expect(() => new UpdateThreadComment(payload)).toThrowError('UPDATE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: true,
      userId: {}
    }

    // Action and Assert
    expect(() => new UpdateThreadComment(payload)).toThrowError('UPDATE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when content contains more than 250 character', () => {
    // Arrange
    const payload = {
      id: 'comment-1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in velit mollis, iaculis diam in, porttitor dui. Ut vel magna est. Sed cursus, lectus sed lobortis varius, purus massa vehicula nibh, vitae volutpat risus metus ut libero. Mauris non posuere neque. Vestibulum ornare finibus dapibus. Aenean luctus nulla laoreet felis suscipit posuere. Cras a scelerisque tortor, sit amet pharetra enim.',
      userId: 'user-1'
    }

    // Action and Assert
    expect(() => new UpdateThreadComment(payload)).toThrowError('UPDATE_THREAD_COMMENT.CONTENT_LIMIT_CHAR')
  })

  it('should create UpdateThreadComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-1',
      content: 'content comment',
      userId: 'user-1'
    }

    // Action
    const { id, content, owner } = new UpdateThreadComment(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
  })
})
