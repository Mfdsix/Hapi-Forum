const CreateThread = require('../../../Domains/threads/entities/CreateThread')

class CreateThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    return this._threadRepository.create(new CreateThread(useCasePayload))
  }
}

module.exports = CreateThreadUseCase
