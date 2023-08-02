const UpdateThread = require('../../../Domains/threads/entities/UpdateThread')

class UpdateThreadByIdThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    this._threadRepository.checkAvailability(useCasePayload.id)
    return this._threadRepository.updateById(new UpdateThread(useCasePayload))
  }
}

module.exports = UpdateThreadByIdThreadUseCase
