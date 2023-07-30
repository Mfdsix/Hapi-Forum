const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const DeleteByIdThreadUseCase = require('../DeleteByIdUseCase')

describe('DeleteByIdThreadUseCase', () => {
  it('should orchestrating the delete thread by id action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123'
    const mockThreadRepository = new ThreadRepository()

    // Mocking
    mockThreadRepository.deleteById = jest.fn()
      .mockImplementation((id) => Promise.resolve({
        id
      }))

    // create use case instance
    const deleteByIdThreadUseCase = new DeleteByIdThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const deleted = await deleteByIdThreadUseCase.execute(useCasePayload)

    // Assert
    expect(deleted).toEqual({
      id: useCasePayload
    })
  })
})
