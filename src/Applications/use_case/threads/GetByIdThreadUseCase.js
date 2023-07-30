class GetByIdThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    return this._threadRepository.getById(useCasePayload)
  }
}

module.exports = GetByIdThreadUseCase
