const ThreadCommentRepository = require('../../../../Domains/thread-comments/ThreadCommentRepository')
const UpdateThreadCommentUseCase = require('../UpdateThreadCommentUseCase')
const UpdateThreadComment = require('../../../../Domains/thread-comments/entities/UpdateThreadComment')

describe('UpdateThreadCommentUseCase', () => {
  it('should orchestrating the update comment action correctly', async () => {
    // Arrange
    const useCasePayload = new UpdateThreadComment({
      id: 'comment-1',
      content: 'update content of comment',
      userId: 'owner-1'
    })
    const mockThreadCommentRepository = new ThreadCommentRepository()

    // Mocking
    mockThreadCommentRepository.checkAvailability = jest.fn()
      .mockImplementation((payload) => Promise.resolve())
    mockThreadCommentRepository.checkAccess = jest.fn()
      .mockImplementation((payload) => Promise.resolve())
    mockThreadCommentRepository.updateById = jest.fn()
      .mockImplementation((payload) => payload.id)

    // create use case instance
    const updateThreadCommentUseCase = new UpdateThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository
    })

    // Action
    const updated = await updateThreadCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadCommentRepository.checkAvailability).toBeCalledWith(useCasePayload.id)
    expect(mockThreadCommentRepository.checkAccess).toBeCalledWith({
      commentId: useCasePayload.id,
      userId: useCasePayload.userId
    })
    expect(mockThreadCommentRepository.updateById).toBeCalledWith(useCasePayload)
    expect(updated).toEqual(useCasePayload.id)
  })
})
