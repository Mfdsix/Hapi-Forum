class GetAllThreadsUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute () {
    return this._threadRepository.getAll()
  }
}

module.exports = GetAllThreadsUseCase
