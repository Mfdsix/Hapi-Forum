const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const UpdateByIdThreadUseCase = require('../UpdateByIdUseCase')

describe('UpdateByIdThreadUseCase', () => {
  it('should orchestrating the update thread by id action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
      title: 'test',
      body: 'body of test'
    }
    const mockThreadRepository = new ThreadRepository()

    // Mocking
    mockThreadRepository.updateById = jest.fn()
      .mockImplementation((id, payload) => Promise.resolve({
        id
      }))

    // create use case instance
    const updateByIdThreadUseCase = new UpdateByIdThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const updated = await updateByIdThreadUseCase.execute(useCasePayload)

    // Assert
    expect(updated).toEqual({
      id: useCasePayload.id
    })
  })
})
