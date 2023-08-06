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
        owner: 'user-1',
        created_at: currDate
      },
      {
        id: 'thread-2',
        title: 'Thread 2',
        body: 'content of Thread 2',
        username: 'owner1',
        owner: 'user-1',
        created_at: currDate
      },
      {
        id: 'thread-3',
        title: 'Thread 3',
        body: 'content of Thread 3',
        username: 'owner1',
        owner: 'user-1',
        created_at: currDate
      }
    ]
    const threadComment = {
      id: 'comment-1',
      content: 'comment content',
      thread: 'thread-1',
      owner: 'user-1',
      created_at: currDate,
      parent: null,
      deleted_at: null,
      username: 'user app'
    }
    const threadCommentReply = {
      id: 'comment-reply-1',
      parent: 'comment-1',
      thread: 'thread-1',
      content: 'comment content',
      owner: 'user-1',
      username: 'user app',
      created_at: currDate,
      deleted_at: null
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()

    /** mocking needed function */
    mockThreadRepository.getById = jest.fn()
      .mockImplementation((id) => Promise.resolve(mockAddedThreads.filter((thread) => thread.id === id)[0]))
    mockThreadRepository.checkAvailability = jest.fn()
      .mockImplementation((id) => Promise.resolve())
    mockThreadCommentRepository.getByThreadId = jest.fn()
      .mockImplementation((id) => Promise.resolve([
        {
          ...threadComment,
          thread: id
        }
      ]))
    mockThreadCommentRepository.getReplyByCommentId = jest.fn()
      .mockImplementation((id) => Promise.resolve([
        {
          ...threadCommentReply,
          parent: id
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
    expect(mockThreadRepository.checkAvailability).toBeCalledTimes(mockAddedThreads.length)
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
    expect(thread1.date).toStrictEqual(mockAddedThreads[0].created_at)

    expect(thread2).toHaveProperty('id')
    expect(thread2).toHaveProperty('title')
    expect(thread2).toHaveProperty('body')
    expect(thread2).toHaveProperty('username')
    expect(thread2).toHaveProperty('date')
    expect(thread2.id).toStrictEqual(mockAddedThreads[1].id)
    expect(thread2.title).toStrictEqual(mockAddedThreads[1].title)
    expect(thread2.body).toStrictEqual(mockAddedThreads[1].body)
    expect(thread2.username).toStrictEqual(mockAddedThreads[1].username)
    expect(thread2.date).toStrictEqual(mockAddedThreads[1].created_at)

    expect(thread3).toHaveProperty('id')
    expect(thread3).toHaveProperty('title')
    expect(thread3).toHaveProperty('body')
    expect(thread3).toHaveProperty('username')
    expect(thread3).toHaveProperty('date')
    expect(thread3.id).toStrictEqual(mockAddedThreads[2].id)
    expect(thread3.id).toStrictEqual(mockAddedThreads[2].id)
    expect(thread3.title).toStrictEqual(mockAddedThreads[2].title)
    expect(thread3.body).toStrictEqual(mockAddedThreads[2].body)
    expect(thread3.username).toStrictEqual(mockAddedThreads[2].username)
    expect(thread3.date).toStrictEqual(mockAddedThreads[2].created_at)

    expect(thread1.comments.length).toEqual(1)
    expect(thread2.comments.length).toEqual(1)
    expect(thread3.comments.length).toEqual(1)

    expect(thread1.comments[0]).toHaveProperty('id')
    expect(thread1.comments[0]).toHaveProperty('content')
    expect(thread1.comments[0]).toHaveProperty('username')
    expect(thread1.comments[0]).toHaveProperty('date')
    expect(thread1.comments[0].id).toEqual(threadComment.id)
    expect(thread1.comments[0].content).toEqual(threadComment.content)
    expect(thread1.comments[0].username).toEqual(threadComment.username)
    expect(thread1.comments[0].date).toEqual(threadComment.created_at)

    expect(thread1.comments[0].replies.length).toEqual(1)
    expect(thread1.comments[0].replies[0]).toHaveProperty('id')
    expect(thread1.comments[0].replies[0]).toHaveProperty('content')
    expect(thread1.comments[0].replies[0]).toHaveProperty('username')
    expect(thread1.comments[0].replies[0]).toHaveProperty('date')
    expect(thread1.comments[0].replies[0].id).toEqual(threadCommentReply.id)
    expect(thread1.comments[0].replies[0].content).toEqual(threadCommentReply.content)
    expect(thread1.comments[0].replies[0].username).toEqual(threadCommentReply.username)
    expect(thread1.comments[0].replies[0].date).toEqual(threadCommentReply.created_at)

    expect(thread2.comments[0]).toHaveProperty('id')
    expect(thread2.comments[0]).toHaveProperty('content')
    expect(thread2.comments[0]).toHaveProperty('username')
    expect(thread2.comments[0]).toHaveProperty('date')
    expect(thread2.comments[0].id).toEqual(threadComment.id)
    expect(thread2.comments[0].content).toEqual(threadComment.content)
    expect(thread2.comments[0].username).toEqual(threadComment.username)
    expect(thread2.comments[0].date).toEqual(threadComment.created_at)

    expect(thread2.comments[0].replies.length).toEqual(1)
    expect(thread2.comments[0].replies[0]).toHaveProperty('id')
    expect(thread2.comments[0].replies[0]).toHaveProperty('content')
    expect(thread2.comments[0].replies[0]).toHaveProperty('username')
    expect(thread2.comments[0].replies[0]).toHaveProperty('date')
    expect(thread2.comments[0].replies[0].id).toEqual(threadCommentReply.id)
    expect(thread2.comments[0].replies[0].content).toEqual(threadCommentReply.content)
    expect(thread2.comments[0].replies[0].username).toEqual(threadCommentReply.username)
    expect(thread2.comments[0].replies[0].date).toEqual(threadCommentReply.created_at)

    expect(thread3.comments[0]).toHaveProperty('id')
    expect(thread3.comments[0]).toHaveProperty('content')
    expect(thread3.comments[0]).toHaveProperty('username')
    expect(thread3.comments[0]).toHaveProperty('date')
    expect(thread3.comments[0].id).toEqual(threadComment.id)
    expect(thread3.comments[0].content).toEqual(threadComment.content)
    expect(thread3.comments[0].username).toEqual(threadComment.username)
    expect(thread3.comments[0].date).toEqual(threadComment.created_at)

    expect(thread3.comments[0].replies.length).toEqual(1)
    expect(thread3.comments[0].replies[0]).toHaveProperty('id')
    expect(thread3.comments[0].replies[0]).toHaveProperty('content')
    expect(thread3.comments[0].replies[0]).toHaveProperty('username')
    expect(thread3.comments[0].replies[0]).toHaveProperty('date')
    expect(thread3.comments[0].replies[0].id).toEqual(threadCommentReply.id)
    expect(thread3.comments[0].replies[0].content).toEqual(threadCommentReply.content)
    expect(thread3.comments[0].replies[0].username).toEqual(threadCommentReply.username)
    expect(thread3.comments[0].replies[0].date).toEqual(threadCommentReply.created_at)
  })

  it('should return correct transformed thread data', async () => {
    const currDate = new Date().toISOString()
    const threadData = {
      id: 'thread-1',
      title: 'thread title',
      body: 'thread body',
      owner: 'user-1',
      created_at: currDate
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()

    /** mocking needed function */
    mockThreadRepository.getById = jest.fn()
      .mockImplementation((id) => Promise.resolve())
    mockThreadCommentRepository.getByThreadId = jest.fn()
      .mockImplementation((id) => Promise.resolve())
    mockThreadCommentRepository.getReplyByCommentId = jest.fn()
      .mockImplementation((id) => Promise.resolve())

    // create use case instance
    const getByIdThreadUseCase = new GetByIdThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository
    })

    // Action
    const transformed = await getByIdThreadUseCase._transformThread(threadData)

    // Assert
    expect(transformed).toHaveProperty('id')
    expect(transformed).toHaveProperty('title')
    expect(transformed).toHaveProperty('body')
    expect(transformed).toHaveProperty('username')
    expect(transformed).toHaveProperty('date')
    expect(transformed.id).toEqual(threadData.id)
    expect(transformed.title).toEqual(threadData.title)
    expect(transformed.body).toEqual(threadData.body)
    expect(transformed.username).toEqual(threadData.username)
    expect(transformed.date).toEqual(threadData.created_at)
  })

  it('should return plain comment when not have parent and not deleted', async () => {
    const currDate = new Date().toISOString()
    const commentData = {
      id: 'comment-1',
      content: 'comment',
      username: 'user1',
      created_at: currDate,
      parent: null,
      deleted_at: null
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()

    /** mocking needed function */
    mockThreadRepository.getById = jest.fn()
      .mockImplementation((id) => Promise.resolve())
    mockThreadCommentRepository.getByThreadId = jest.fn()
      .mockImplementation((id) => Promise.resolve())
    mockThreadCommentRepository.getReplyByCommentId = jest.fn()
      .mockImplementation((id) => Promise.resolve())

    // create use case instance
    const getByIdThreadUseCase = new GetByIdThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository
    })

    // Action
    const transformed = await getByIdThreadUseCase._transformComment(commentData)

    // Assert
    expect(transformed).toHaveProperty('id')
    expect(transformed).toHaveProperty('content')
    expect(transformed).toHaveProperty('username')
    expect(transformed).toHaveProperty('date')
    expect(transformed.id).toEqual(commentData.id)
    expect(transformed.content).toEqual(commentData.content)
    expect(transformed.username).toEqual(commentData.username)
    expect(transformed.date).toEqual(commentData.created_at)
  })

  it('should return plain comment when have parent and not deleted', async () => {
    const currDate = new Date().toISOString()
    const commentData = {
      id: 'comment-1',
      content: 'comment',
      username: 'user1',
      created_at: currDate,
      parent: 'comment-parent-1',
      deleted_at: null
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()

    /** mocking needed function */
    mockThreadRepository.getById = jest.fn()
      .mockImplementation((id) => Promise.resolve())
    mockThreadCommentRepository.getByThreadId = jest.fn()
      .mockImplementation((id) => Promise.resolve())
    mockThreadCommentRepository.getReplyByCommentId = jest.fn()
      .mockImplementation((id) => Promise.resolve())

    // create use case instance
    const getByIdThreadUseCase = new GetByIdThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository
    })

    // Action
    const transformed = await getByIdThreadUseCase._transformComment(commentData)

    // Assert
    expect(transformed).toHaveProperty('id')
    expect(transformed).toHaveProperty('content')
    expect(transformed).toHaveProperty('username')
    expect(transformed).toHaveProperty('date')
    expect(transformed.id).toEqual(commentData.id)
    expect(transformed.content).toEqual(commentData.content)
    expect(transformed.username).toEqual(commentData.username)
    expect(transformed.date).toEqual(commentData.created_at)
  })

  it('should return **komentar telah dihapus** when not have parent and deleted', async () => {
    const currDate = new Date().toISOString()
    const commentData = {
      id: 'comment-1',
      content: 'comment',
      username: 'user1',
      created_at: currDate,
      parent: null,
      deleted_at: currDate
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()

    /** mocking needed function */
    mockThreadRepository.getById = jest.fn()
      .mockImplementation((id) => Promise.resolve())
    mockThreadCommentRepository.getByThreadId = jest.fn()
      .mockImplementation((id) => Promise.resolve())
    mockThreadCommentRepository.getReplyByCommentId = jest.fn()
      .mockImplementation((id) => Promise.resolve())

    // create use case instance
    const getByIdThreadUseCase = new GetByIdThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository
    })

    // Action
    const transformed = await getByIdThreadUseCase._transformComment(commentData)

    // Assert
    expect(transformed).toHaveProperty('id')
    expect(transformed).toHaveProperty('content')
    expect(transformed).toHaveProperty('username')
    expect(transformed).toHaveProperty('date')
    expect(transformed.id).toEqual(commentData.id)
    expect(transformed.content).toEqual('**komentar telah dihapus**')
    expect(transformed.username).toEqual(commentData.username)
    expect(transformed.date).toEqual(commentData.created_at)
  })

  it('should return **balasan telah dihapus** when have parent and deleted', async () => {
    const currDate = new Date().toISOString()
    const commentData = {
      id: 'comment-1',
      content: 'comment',
      username: 'user1',
      created_at: currDate,
      parent: 'comment-parent-1',
      deleted_at: currDate
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()

    /** mocking needed function */
    mockThreadRepository.getById = jest.fn()
      .mockImplementation((id) => Promise.resolve())
    mockThreadCommentRepository.getByThreadId = jest.fn()
      .mockImplementation((id) => Promise.resolve())
    mockThreadCommentRepository.getReplyByCommentId = jest.fn()
      .mockImplementation((id) => Promise.resolve())

    // create use case instance
    const getByIdThreadUseCase = new GetByIdThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository
    })

    // Action
    const transformed = await getByIdThreadUseCase._transformComment(commentData)

    // Assert
    expect(transformed).toHaveProperty('id')
    expect(transformed).toHaveProperty('content')
    expect(transformed).toHaveProperty('username')
    expect(transformed).toHaveProperty('date')
    expect(transformed.id).toEqual(commentData.id)
    expect(transformed.content).toEqual('**balasan telah dihapus**')
    expect(transformed.username).toEqual(commentData.username)
    expect(transformed.date).toEqual(commentData.created_at)
  })
})
