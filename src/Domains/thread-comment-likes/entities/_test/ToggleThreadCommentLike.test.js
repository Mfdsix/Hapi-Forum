const ToggleThreadCommentLike = require('../ToggleThreadCommentLike')

describe('a ToggleThreadCommentLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      key: 'value'
    }

    // Action and Assert
    expect(() => new ToggleThreadCommentLike(payload)).toThrowError('TOGGLE_THREAD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 456,
      commentId: 123,
      userId: true
    }

    // Action and Assert
    expect(() => new ToggleThreadCommentLike(payload)).toThrowError('TOGGLE_THREAD_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create ToggleThreadCommentLike object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-1',
      commentId: 'comment-1',
      userId: 'user-1'
    }

    // Action
    const { threadId, commentId, userId } = new ToggleThreadCommentLike(payload)

    // Assert
    expect(threadId).toEqual(payload.threadId)
    expect(commentId).toEqual(payload.commentId)
    expect(userId).toEqual(payload.userId)
  })
})
