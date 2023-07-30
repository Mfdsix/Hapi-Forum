class UpdateByIdThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (dataId, useCasePayload) {
    return this._threadRepository.updateById(dataId, useCasePayload)
  }
}

module.exports = UpdateByIdThreadUseCase
