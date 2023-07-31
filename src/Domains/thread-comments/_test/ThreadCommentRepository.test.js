const ThreadCommentRepository = require('../ThreadCommentRepository')

describe('ThreadCommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepository()

    // Action and Assert
    await expect(threadCommentRepository.getByThreadId('thread-123')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentRepository.getRepllyByCommentId('comment-123')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentRepository.create({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentRepository.reply({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentRepository.updateById({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentRepository.deleteById({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
