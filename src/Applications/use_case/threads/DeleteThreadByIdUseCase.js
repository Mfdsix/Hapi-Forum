class DeleteThreadByIdThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    this._threadRepository.checkAvailability(useCasePayload.id)
    return this._threadRepository.deleteById(useCasePayload)
  }
}

module.exports = DeleteThreadByIdThreadUseCase
