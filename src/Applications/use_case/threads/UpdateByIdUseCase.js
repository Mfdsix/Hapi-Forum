class UpdateByIdThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    return this._threadRepository.updateById(useCasePayload.id, useCasePayload)
  }
}

module.exports = UpdateByIdThreadUseCase
