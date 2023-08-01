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
    expect(mockThreadRepository.updateById).toBeCalledWith(useCasePayload)
    expect(updated).toEqual({
      id: useCasePayload.id
    })
  })
})
