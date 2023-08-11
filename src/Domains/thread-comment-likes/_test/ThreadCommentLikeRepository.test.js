const ThreadCommentLikeRepository = require('../ThreadCommentLikeRepository')

describe('ThreadThreadCommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentLikeRepository = new ThreadCommentLikeRepository()

    // Action and Assert
    await expect(threadCommentLikeRepository.countByCommentId('comment-123')).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentLikeRepository.checkExists({})).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentLikeRepository.likeComment({})).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentLikeRepository.unlikeComment({})).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentLikeRepository.toggleLike({})).rejects.toThrowError('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
