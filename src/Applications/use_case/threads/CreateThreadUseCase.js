class CreateThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    return this._threadRepository.create(useCasePayload)
  }
}

module.exports = CreateThreadUseCase
