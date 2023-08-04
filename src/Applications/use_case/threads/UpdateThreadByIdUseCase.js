const UpdateThread = require('../../../Domains/threads/entities/UpdateThread')

class UpdateThreadByIdThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const payload = new UpdateThread(useCasePayload)
    await this._threadRepository.checkAvailability(payload.id)
    await this._threadRepository.checkAccess({
      threadId: payload.id,
      userId: payload.userId
    })
    return this._threadRepository.updateById(payload)
  }
}

module.exports = UpdateThreadByIdThreadUseCase
