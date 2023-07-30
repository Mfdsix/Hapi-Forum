const GetAllThreadsUseCase = require('../../../../Applications/use_case/threads/GetAllThreadsUseCase')
const GetByIdThreadUseCase = require('../../../../Applications/use_case/threads/GetByIdThreadUseCase')
const CreateThreadUseCase = require('../../../../Applications/use_case/threads/CreateThreadUseCase')
const UpdateByIdThreadUseCase = require('../../../../Applications/use_case/threads/UpdateByIdUseCase')
const DeleteByIdUseCase = require('../../../../Applications/use_case/threads/DeleteByIdUseCase')

const HttpResponse = require('../../../../Commons/HttpResponse')
const autoBind = require('auto-bind')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async getAllHandler () {
    const useCase = this._container.getInstance(GetAllThreadsUseCase.name)
    const threads = await useCase.execute()

    return HttpResponse.success({
      data: {
        threads
      }
    })
  }

  async getByIdHandler (request) {
    const { id } = request.params
    const useCase = this._container.getInstance(GetByIdThreadUseCase.name)

    const thread = await useCase.execute(id)

    return HttpResponse.success({
      data: {
        thread
      }
    })
  }

  async postHandler (request) {
    const { title, body } = request.params
    const { id: credentialId } = request.auth.credentials
    const useCase = this._container.getInstance(CreateThreadUseCase.name)

    const thread = await useCase.execute({
      title,
      body,
      owner: credentialId
    })

    return HttpResponse.success({
      message: 'thread berhasil dibuat',
      data: thread.id
    })
  }

  async putByIdHandler (request) {
    const { id } = request.params
    const { title, body } = request.params
    const { id: credentialId } = request.auth.credentials
    const useCase = this._container.getInstance(UpdateByIdThreadUseCase.name)

    const updatedId = await useCase.execute(id, {
      title,
      body,
      owner: credentialId
    })

    return HttpResponse.success({
      message: 'thread berhasil diupdate',
      data: updatedId
    })
  }

  async deleteByIdHandler (request) {
    const { id } = request.params
    const useCase = this._container.getInstance(DeleteByIdUseCase.name)

    const deletedId = await useCase.execute(id)

    return HttpResponse.success({
      message: 'thread berhasil diupdate',
      data: deletedId
    })
  }
}

module.exports = ThreadsHandler
