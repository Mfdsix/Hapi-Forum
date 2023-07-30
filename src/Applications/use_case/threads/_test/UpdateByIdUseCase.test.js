const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const UpdateByIdThreadUseCase = require('../UpdateByIdUseCase')

describe('UpdateByIdThreadUseCase', () => {
  it('should orchestrating the update thread by id action correctly', async () => {
    // Arrange
    const dataId = 'thread-123'
    const useCasePayload = {
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
    const updated = await updateByIdThreadUseCase.execute(dataId, useCasePayload)

    // Assert
    expect(updated).toEqual({
      id: dataId
    })
  })
})
