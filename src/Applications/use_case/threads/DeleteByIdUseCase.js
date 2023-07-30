class DeleteByIdThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    return this._threadRepository.deleteById(useCasePayload)
  }
}

module.exports = DeleteByIdThreadUseCase
