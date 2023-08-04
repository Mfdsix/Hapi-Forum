const ThreadCommentRepository = require('../../../../Domains/thread-comments/ThreadCommentRepository')
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase')
const DeleteThreadComment = require('../../../../Domains/thread-comments/entities/DeleteThreadComment')

describe('DeleteThreadCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = new DeleteThreadComment({
      id: 'comment-1',
      userId: 'owner-1'
    })
    const mockThreadCommentRepository = new ThreadCommentRepository()

    // Mocking
    mockThreadCommentRepository.checkAvailability = jest.fn()
      .mockImplementation((payload) => Promise.resolve())
    mockThreadCommentRepository.checkAccess = jest.fn()
      .mockImplementation((payload) => Promise.resolve())
    mockThreadCommentRepository.deleteById = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload.id))

    // create use case instance
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository
    })

    // Action
    const deleted = await deleteThreadCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadCommentRepository.checkAvailability).toBeCalledWith(useCasePayload.id)
    expect(mockThreadCommentRepository.checkAccess).toBeCalledWith({
      commentId: useCasePayload.id,
      userId: useCasePayload.userId
    })
    expect(mockThreadCommentRepository.deleteById).toBeCalledWith(useCasePayload)
    expect(deleted).toEqual(useCasePayload.id)
  })
})
