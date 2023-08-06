const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const DeleteThreadByIdThreadUseCase = require('../DeleteThreadByIdUseCase')

describe('DeleteByIdThreadUseCase', () => {
  it('should orchestrating the delete thread by id action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
      userId: 'user-1'
    }
    const mockThreadRepository = new ThreadRepository()

    // Mocking
    mockThreadRepository.checkAvailability = jest.fn()
      .mockImplementation((payload) => Promise.resolve())
    mockThreadRepository.checkAccess = jest.fn()
      .mockImplementation((payload) => Promise.resolve())
    mockThreadRepository.deleteById = jest.fn()
      .mockImplementation(({ id }) => Promise.resolve({
        id
      }))

    // create use case instance
    const deleteByIdThreadUseCase = new DeleteThreadByIdThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const deleted = await deleteByIdThreadUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkAvailability).toBeCalledWith(useCasePayload.id)
    expect(mockThreadRepository.checkAccess).toBeCalledWith({
      threadId: useCasePayload.id,
      userId: useCasePayload.userId
    })
    expect(mockThreadRepository.deleteById).toBeCalledWith(useCasePayload)
    expect(deleted).toEqual({
      id: useCasePayload.id
    })
  })
})
