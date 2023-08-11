const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const ThreadCommentRepository = require('../../../../Domains/thread-comments/ThreadCommentRepository')
const ThreadCommentLikeRepository = require('../../../../Domains/thread-comment-likes/ThreadCommentLikeRepository')
const ToggleThreadCommentLike = require('../../../../Domains/thread-comment-likes/entities/ToggleThreadCommentLike')
const ToggleThreadCommentLikeUseCase = require('../ToggleThreadCommentUseCase')

describe('ToggleThreadCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const useCasePayload = new ToggleThreadCommentLike({
      threadId: 'thread-1',
      commentId: 'comment-1',
      userId: 'user-1'
    })
    const mockThreadRepository = new ThreadRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()
    const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository()

    // Mocking
    mockThreadRepository.checkAvailability = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))
    mockThreadCommentRepository.checkAvailability = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))

    mockThreadCommentLikeRepository.checkExists = jest.fn()
      .mockImplementation((payload) => Promise.resolve(true))
    mockThreadCommentLikeRepository.likeComment = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))
    mockThreadCommentLikeRepository.unlikeComment = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))
    mockThreadCommentLikeRepository.toggleLike = jest.fn()
      .mockImplementation(async (payload) => {
        const isExists = await mockThreadCommentLikeRepository.checkExists(payload)
        if (isExists) {
          return mockThreadCommentLikeRepository.likeComment(payload)
        } else {
          return mockThreadCommentLikeRepository.unlikeComment(payload)
        }
      })

    // create use case instance
    const toggleThreadCommentLikeUseCase = new ToggleThreadCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository
    })

    // Action
    await toggleThreadCommentLikeUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkAvailability).toBeCalledWith(useCasePayload.threadId)
    expect(mockThreadCommentRepository.checkAvailability).toBeCalledWith(useCasePayload.commentId)
    expect(mockThreadCommentLikeRepository.toggleLike).toBeCalledWith(useCasePayload)
    expect(mockThreadCommentLikeRepository.checkExists).toBeCalledWith(useCasePayload)
    expect(mockThreadCommentLikeRepository.likeComment).toBeCalledWith(useCasePayload)
    expect(mockThreadCommentLikeRepository.unlikeComment).not.toBeCalled()
  })

  it('should orchestrating the unlike comment action correctly', async () => {
    // Arrange
    const useCasePayload = new ToggleThreadCommentLike({
      threadId: 'thread-1',
      commentId: 'comment-1',
      userId: 'user-1'
    })
    const mockThreadRepository = new ThreadRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()
    const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository()

    // Mocking
    mockThreadRepository.checkAvailability = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))
    mockThreadCommentRepository.checkAvailability = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))

    mockThreadCommentLikeRepository.checkExists = jest.fn()
      .mockImplementation((payload) => Promise.resolve(false))
    mockThreadCommentLikeRepository.likeComment = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))
    mockThreadCommentLikeRepository.unlikeComment = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))
    mockThreadCommentLikeRepository.toggleLike = jest.fn()
      .mockImplementation(async (payload) => {
        const isExists = await mockThreadCommentLikeRepository.checkExists(payload)
        if (isExists) {
          return mockThreadCommentLikeRepository.likeComment(payload)
        } else {
          return mockThreadCommentLikeRepository.unlikeComment(payload)
        }
      })

    // create use case instance
    const toggleThreadCommentLikeUseCase = new ToggleThreadCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository
    })

    // Action
    await toggleThreadCommentLikeUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkAvailability).toBeCalledWith(useCasePayload.threadId)
    expect(mockThreadCommentRepository.checkAvailability).toBeCalledWith(useCasePayload.commentId)
    expect(mockThreadCommentLikeRepository.toggleLike).toBeCalledWith(useCasePayload)
    expect(mockThreadCommentLikeRepository.checkExists).toBeCalledWith(useCasePayload)
    expect(mockThreadCommentLikeRepository.unlikeComment).toBeCalledWith(useCasePayload)
    expect(mockThreadCommentLikeRepository.likeComment).not.toBeCalled()
  })
})
