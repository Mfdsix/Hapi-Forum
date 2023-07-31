const UpdateThread = require('../../../Domains/threads/entities/UpdateThread')

class UpdateThreadByIdThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    return this._threadRepository.updateById(new UpdateThread(useCasePayload))
  }
}

module.exports = UpdateThreadByIdThreadUseCase
