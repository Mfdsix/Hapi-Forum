const ThreadRepository = require('../../../../Domains/threads/ThreadRepository')
const ThreadCommentRepository = require('../../../../Domains/thread-comments/ThreadCommentRepository')
const GetByIdThreadUseCase = require('../GetByIdThreadUseCase')

describe('GetByIdThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get one thread by id action correctly', async () => {
    // Arrange
    const currDate = new Date().toISOString()
    const mockAddedThreads = [
      {
        id: 'thread-1',
        title: 'Thread 1',
        body: 'content of Thread 1',
        username: 'owner1',
        date: currDate
      },
      {
        id: 'thread-2',
        title: 'Thread 2',
        body: 'content of Thread 2',
        username: 'owner1',
        date: currDate
      },
      {
        id: 'thread-3',
        title: 'Thread 3',
        body: 'content of Thread 3',
        username: 'owner1',
        date: currDate
      }
    ]

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()

    /** mocking needed function */
    mockThreadRepository.getById = jest.fn()
      .mockImplementation((id) => Promise.resolve(mockAddedThreads.filter((thread) => thread.id === id)[0]))
    mockThreadCommentRepository.getByThreadId = jest.fn()
      .mockImplementation((id) => Promise.resolve([
        {
          id: 'comment-1',
          content: 'comment content',
          username: 'user-1',
          date: currDate
        }
      ]))
    mockThreadCommentRepository.getReplyByCommentId = jest.fn()
      .mockImplementation((id) => Promise.resolve([
        {
          id: 'comment-1',
          content: 'comment content',
          username: 'user-1',
          date: currDate
        }
      ]))

    // create use case instance
    const getByIdThreadUseCase = new GetByIdThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository
    })

    // Action
    const thread1 = await getByIdThreadUseCase.execute(mockAddedThreads[0].id)
    const thread2 = await getByIdThreadUseCase.execute(mockAddedThreads[1].id)
    const thread3 = await getByIdThreadUseCase.execute(mockAddedThreads[2].id)

    // Assert
    expect(mockThreadRepository.getById).toBeCalledTimes(mockAddedThreads.length)
    expect(mockThreadCommentRepository.getByThreadId).toBeCalledTimes(mockAddedThreads.length)
    expect(mockThreadCommentRepository.getReplyByCommentId).toBeCalledTimes(mockAddedThreads.length)
    expect(thread1).toHaveProperty('id')
    expect(thread1).toHaveProperty('title')
    expect(thread1).toHaveProperty('body')
    expect(thread1).toHaveProperty('username')
    expect(thread1).toHaveProperty('date')
    expect(thread1.id).toStrictEqual(mockAddedThreads[0].id)
    expect(thread1.title).toStrictEqual(mockAddedThreads[0].title)
    expect(thread1.body).toStrictEqual(mockAddedThreads[0].body)
    expect(thread1.username).toStrictEqual(mockAddedThreads[0].username)
    expect(thread1.date).toStrictEqual(mockAddedThreads[0].date)
    expect(thread2.id).toStrictEqual(mockAddedThreads[1].id)
    expect(thread3.id).toStrictEqual(mockAddedThreads[2].id)
    expect(thread1.comments.length).toEqual(1)
    expect(thread2.comments.length).toEqual(1)
    expect(thread3.comments.length).toEqual(1)
    expect(thread1.comments[0]).toHaveProperty('id')
    expect(thread1.comments[0]).toHaveProperty('content')
    expect(thread1.comments[0]).toHaveProperty('username')
    expect(thread1.comments[0]).toHaveProperty('date')
    expect(thread1.comments[0].replies.length).toEqual(1)
    expect(thread1.comments[0].replies[0]).toHaveProperty('id')
    expect(thread1.comments[0].replies[0]).toHaveProperty('content')
    expect(thread1.comments[0].replies[0]).toHaveProperty('username')
    expect(thread1.comments[0].replies[0]).toHaveProperty('date')
    expect(thread2.comments[0].replies.length).toEqual(1)
    expect(thread3.comments[0].replies.length).toEqual(1)
  })
})
