const ReplyThreadComment = require('../ReplyThreadComment')

describe('a ReplyThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      key: 'value'
    }

    // Action and Assert
    expect(() => new ReplyThreadComment(payload)).toThrowError('REPLY_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      content: true,
      owner: {},
      parentId: 323
    }

    // Action and Assert
    expect(() => new ReplyThreadComment(payload)).toThrowError('REPLY_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when content contains more than 250 character', () => {
    // Arrange
    const payload = {
      threadId: 'thread-1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in velit mollis, iaculis diam in, porttitor dui. Ut vel magna est. Sed cursus, lectus sed lobortis varius, purus massa vehicula nibh, vitae volutpat risus metus ut libero. Mauris non posuere neque. Vestibulum ornare finibus dapibus. Aenean luctus nulla laoreet felis suscipit posuere. Cras a scelerisque tortor, sit amet pharetra enim.',
      owner: 'user-1',
      parentId: 'comment-1'
    }

    // Action and Assert
    expect(() => new ReplyThreadComment(payload)).toThrowError('REPLY_THREAD_COMMENT.TITLE_LIMIT_CHAR')
  })

  it('should create ReplyThreadComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-1',
      content: 'reply comment',
      owner: 'user-1',
      parentId: 'comment-1'
    }

    // Action
    const { threadId, content, owner, parentId } = new ReplyThreadComment(payload)

    // Assert
    expect(threadId).toEqual(payload.threadId)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
    expect(parentId).toEqual(payload.parentId)
  })
})
