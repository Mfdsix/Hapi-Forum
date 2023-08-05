const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const ThreadCommentRepository = require('../../../../Domains/thread-comments/ThreadCommentRepository')
const ReplyThreadCommentUseCase = require('../ReplyThreadCommentUseCase')
const ReplyThreadComment = require('../../../../Domains/thread-comments/entities/ReplyThreadComment')
const CreatedThreadComment = require('../../../../Domains/thread-comments/entities/CreatedThreadComment')

describe('ReplyThreadCommentUseCase', () => {
  it('should orchestrating the reply comment action correctly', async () => {
    // Arrange
    const useCasePayload = new ReplyThreadComment({
      threadId: 'thread-1',
      parentId: 'comment-1',
      content: 'content of comment',
      owner: 'owner-1'
    })
    const mockThreadRepository = new ThreadRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()

    // Mocking
    mockThreadRepository.checkAvailability = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))
    mockThreadCommentRepository.checkAvailability = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))
    mockThreadCommentRepository.reply = jest.fn()
      .mockImplementation((payload) => Promise.resolve(new CreatedThreadComment({
        id: 'comment-123',
        content: payload.content,
        owner: payload.owner
      })))

    // create use case instance
    const replyThreadCommentUseCase = new ReplyThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    await replyThreadCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkAvailability).toBeCalledWith(useCasePayload.threadId)
    expect(mockThreadCommentRepository.checkAvailability).toBeCalledWith(useCasePayload.parentId)
    expect(mockThreadCommentRepository.reply).toBeCalledWith(useCasePayload)
  })
})
