const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const CreateThreadUseCase = require('../CreateThreadUseCase')
const CreatedThread = require('../../../../Domains/threads/entities/CreatedThread')

describe('CreateThreadUseCase', () => {
  it('should orchestrating the create thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'test',
      body: 'body of test',
      owner: 'owner-1'
    }
    const mockThreadRepository = new ThreadRepository()

    // Mocking
    mockThreadRepository.create = jest.fn()
      .mockImplementation((payload) => Promise.resolve(new CreatedThread({
        id: 'thread-123',
        title: payload.title,
        owner: payload.owner
      })))

    // create use case instance
    const createThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const created = await createThreadUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.create).toBeCalledWith(useCasePayload)
    expect(created).toEqual(new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner
    }))
  })
})
