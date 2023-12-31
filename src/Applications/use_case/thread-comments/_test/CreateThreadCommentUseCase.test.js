const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const ThreadCommentRepository = require('../../../../Domains/thread-comments/ThreadCommentRepository')
const CreateThreadCommentUseCase = require('../CreateThreadCommentUseCase')
const CreatedThreadComment = require('../../../../Domains/thread-comments/entities/CreatedThreadComment')
const CreateThreadComment = require('../../../../Domains/thread-comments/entities/CreateThreadComment')

describe('CreateThreadCommentUseCase', () => {
  it('should orchestrating the create comment action correctly', async () => {
    // Arrange
    const useCasePayload = new CreateThreadComment({
      threadId: 'thread-1',
      content: 'content of comment',
      owner: 'owner-1'
    })
    const mockThreadRepository = new ThreadRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()

    // Mocking
    mockThreadRepository.checkAvailability = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))
    mockThreadCommentRepository.create = jest.fn()
      .mockImplementation((payload) => Promise.resolve(new CreatedThreadComment({
        id: 'comment-123',
        content: payload.content,
        owner: payload.owner
      })))

    // create use case instance
    const createThreadCommentUseCase = new CreateThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    await createThreadCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkAvailability).toBeCalledWith(useCasePayload.threadId)
    expect(mockThreadCommentRepository.create).toBeCalledWith(useCasePayload)
  })
})
