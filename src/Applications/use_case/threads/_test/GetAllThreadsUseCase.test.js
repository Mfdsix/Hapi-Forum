const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const GetAllThreadsUseCase = require('../GetAllThreadsUseCase')

describe('GetAllThreadsUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get all threads action correctly', async () => {
    // Arrange
    const mockAddedThreads = [
      {
        id: 'thread-1',
        title: 'Thread 1',
        owner: 'owner1'
      },
      {
        id: 'thread-2',
        title: 'Thread 2',
        owner: 'owner2'
      },
      {
        id: 'thread-3',
        title: 'Thread 3',
        owner: 'owner3'
      }
    ]

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockThreadRepository.getAll = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThreads))

    // create use case instance
    const getAllThreadsUseCase = new GetAllThreadsUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const threads = await getAllThreadsUseCase.execute()

    // Assert
    expect(mockThreadRepository.getAll).toBeCalled()
    expect(threads).toStrictEqual(mockAddedThreads)
    expect(threads.length).toEqual(mockAddedThreads.length)
    expect(threads[0].id).toEqual(mockAddedThreads[0].id)
    expect(threads[1].id).toEqual(mockAddedThreads[1].id)
    expect(threads[2].id).toEqual(mockAddedThreads[2].id)
  })
})
