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
    mockThreadRepository.getById = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))
    mockThreadCommentRepository.getById = jest.fn()
      .mockImplementation((payload) => Promise.resolve(payload))
    mockThreadCommentRepository.reply = jest.fn()
      .mockImplementation((payload) => Promise.resolve({
        id: 'comment-123',
        content: payload.content,
        owner: payload.owner
      }))

    // create use case instance
    const replyThreadCommentUseCase = new ReplyThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const created = await replyThreadCommentUseCase.execute(useCasePayload)

    // Assert
    expect(created).toEqual(new CreatedThreadComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    }))
  })
})
