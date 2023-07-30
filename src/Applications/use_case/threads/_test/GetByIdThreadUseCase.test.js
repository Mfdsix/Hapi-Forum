const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const GetByIdThreadUseCase = require('../GetByIdThreadUseCase')

describe('GetByIdThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get one thread by id action correctly', async () => {
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
    mockThreadRepository.getById = jest.fn()
      .mockImplementation((id) => Promise.resolve(mockAddedThreads.filter((thread) => thread.id === id)[0]))

    // create use case instance
    const getByIdThreadUseCase = new GetByIdThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const thread1 = await getByIdThreadUseCase.execute(mockAddedThreads[0].id)
    const thread2 = await getByIdThreadUseCase.execute(mockAddedThreads[1].id)
    const thread3 = await getByIdThreadUseCase.execute(mockAddedThreads[2].id)

    // Assert
    expect(thread1).toStrictEqual(mockAddedThreads[0])
    expect(thread2).toStrictEqual(mockAddedThreads[1])
    expect(thread3).toStrictEqual(mockAddedThreads[2])
    expect(thread1.id).toStrictEqual(mockAddedThreads[0].id)
    expect(thread2.id).toStrictEqual(mockAddedThreads[1].id)
    expect(thread3.id).toStrictEqual(mockAddedThreads[2].id)
  })
})
