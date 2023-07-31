const CreateThreadComment = require('../CreateThreadComment')

describe('a CreateThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      key: 'value'
    }

    // Action and Assert
    expect(() => new CreateThreadComment(payload)).toThrowError('CREATE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      content: true,
      owner: {}
    }

    // Action and Assert
    expect(() => new CreateThreadComment(payload)).toThrowError('CREATE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when content contains more than 250 character', () => {
    // Arrange
    const payload = {
      threadId: 'thread-1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in velit mollis, iaculis diam in, porttitor dui. Ut vel magna est. Sed cursus, lectus sed lobortis varius, purus massa vehicula nibh, vitae volutpat risus metus ut libero. Mauris non posuere neque. Vestibulum ornare finibus dapibus. Aenean luctus nulla laoreet felis suscipit posuere. Cras a scelerisque tortor, sit amet pharetra enim.',
      owner: 'user-1'
    }

    // Action and Assert
    expect(() => new CreateThreadComment(payload)).toThrowError('CREATE_THREAD_COMMENT.CONTENT_LIMIT_CHAR')
  })

  it('should create CreateThreadComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-1',
      content: 'content comment',
      owner: 'user-1'
    }

    // Action
    const { threadId, content, owner } = new CreateThreadComment(payload)

    // Assert
    expect(threadId).toEqual(payload.threadId)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
  })
})
