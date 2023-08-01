/* istanbul ignore file */

const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const PasswordHash = require('../Applications/security/PasswordHash')
const BcryptPasswordHash = require('./security/BcryptPasswordHash')

const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres')
const ThreadCommentRepositoryPostgres = require('./repository/ThreadCommentRepositoryPostgres')

const UserRepository = require('../Domains/users/UserRepository')
const ThreadRepository = require('../Domains/threads/ThreadRepository')
const ThreadCommentRepository = require('../Domains/thread-comments/ThreadCommentRepository')

// use case
const AddUserUseCase = require('../Applications/use_case/users/AddUserUseCase')
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager')
const JwtTokenManager = require('./security/JwtTokenManager')
const LoginUserUseCase = require('../Applications/use_case/users/LoginUserUseCase')
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const LogoutUserUseCase = require('../Applications/use_case/users/LogoutUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_case/authentications/RefreshAuthenticationUseCase')

const GetAllThreadsUseCase = require('../Applications/use_case/threads/GetAllThreadsUseCase')
const GetByIdThreadUseCase = require('../Applications/use_case/threads/GetByIdThreadUseCase')
const CreateThreadUseCase = require('../Applications/use_case/threads/CreateThreadUseCase')
const UpdateThreadByIdUseCase = require('../Applications/use_case/threads/UpdateThreadByIdUseCase')
const DeleteThreadByIdUseCase = require('../Applications/use_case/threads/DeleteThreadByIdUseCase')

const CreateThreadCommentUseCase = require('../Applications/use_case/thread-comments/CreateThreadCommentUseCase')
const ReplyThreadCommentUseCase = require('../Applications/use_case/thread-comments/ReplyThreadCommentUseCase')
const UpdateThreadCommentUseCase = require('../Applications/use_case/thread-comments/UpdateThreadCommentUseCase')
const DeleteThreadCommentUseCase = require('../Applications/use_case/thread-comments/DeleteThreadCommentUseCase')

// creating container
const container = createContainer()

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        }
      ]
    }
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: ThreadCommentRepository.name,
    Class: ThreadCommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token
        }
      ]
    }
  }
])

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        }
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        }
      ]
    }
  },
  // thread use cases
  {
    key: GetAllThreadsUseCase.name,
    Class: GetAllThreadsUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: GetByIdThreadUseCase.name,
    Class: GetByIdThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        }
      ]
    }
  },
  {
    key: CreateThreadUseCase.name,
    Class: CreateThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: UpdateThreadByIdUseCase.name,
    Class: UpdateThreadByIdUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: DeleteThreadByIdUseCase.name,
    Class: DeleteThreadByIdUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: CreateThreadCommentUseCase.name,
    Class: CreateThreadCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        }
      ]
    }
  },
  {
    key: ReplyThreadCommentUseCase.name,
    Class: ReplyThreadCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        }
      ]
    }
  },
  {
    key: UpdateThreadCommentUseCase.name,
    Class: UpdateThreadCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        }
      ]
    }
  },
  {
    key: DeleteThreadCommentUseCase.name,
    Class: DeleteThreadCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        }
      ]
    }
  }
])

module.exports = container
