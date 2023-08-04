const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const UpdateThreadByIdUseCase = require('../UpdateThreadByIdUseCase')

describe('UpdateByIdThreadUseCase', () => {
  it('should orchestrating the update thread by id action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
      title: 'test',
      body: 'body of test',
      userId: 'user-1'
    }
    const mockThreadRepository = new ThreadRepository()

    // Mocking
    mockThreadRepository.checkAvailability = jest.fn()
      .mockImplementation((payload) => Promise.resolve())
    mockThreadRepository.checkAccess = jest.fn()
      .mockImplementation((payload) => Promise.resolve())
    mockThreadRepository.updateById = jest.fn()
      .mockImplementation((payload) => Promise.resolve({
        id: payload.id
      }))

    // create use case instance
    const updateByIdThreadUseCase = new UpdateThreadByIdUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const updated = await updateByIdThreadUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkAvailability).toBeCalledWith(useCasePayload.id)
    expect(mockThreadRepository.checkAccess).toBeCalledWith({
      threadId: useCasePayload.id,
      userId: useCasePayload.userId
    })
    expect(mockThreadRepository.updateById).toBeCalledWith(useCasePayload)
    expect(updated).toEqual({
      id: useCasePayload.id
    })
  })
})
