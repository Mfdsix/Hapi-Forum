class DeleteThreadByIdThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    await this._threadRepository.checkAvailability(useCasePayload.id)
    await this._threadRepository.checkAccess({
      threadId: useCasePayload.id,
      userId: useCasePayload.userId
    })
    return this._threadRepository.deleteById(useCasePayload)
  }
}

module.exports = DeleteThreadByIdThreadUseCase
