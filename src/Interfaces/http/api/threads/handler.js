const GetAllThreadsUseCase = require('../../../../Applications/use_case/threads/GetAllThreadsUseCase')
const GetByIdThreadUseCase = require('../../../../Applications/use_case/threads/GetByIdThreadUseCase')
const CreateThreadUseCase = require('../../../../Applications/use_case/threads/CreateThreadUseCase')
const UpdateThreadByIdUseCase = require('../../../../Applications/use_case/threads/UpdateThreadByIdUseCase')
const DeleteThreadByIdUseCase = require('../../../../Applications/use_case/threads/DeleteThreadByIdUseCase')

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

  async postHandler (request, h) {
    const { title, body } = request.payload
    const { id: credentialId } = request.auth.credentials
    const useCase = this._container.getInstance(CreateThreadUseCase.name)

    const addedThread = await useCase.execute({
      title,
      body,
      owner: credentialId
    })

    const response = h.response(HttpResponse.success({
      message: 'thread berhasil dibuat',
      data: {
        addedThread
      }
    }))
    response.code(201)

    return response
  }

  async putByIdHandler (request) {
    const { id } = request.params
    const { title, body } = request.payload
    const { id: credentialId } = request.auth.credentials

    const useCase = this._container.getInstance(UpdateThreadByIdUseCase.name)

    const updatedId = await useCase.execute({
      id,
      title,
      body,
      userId: credentialId
    })

    return HttpResponse.success({
      message: 'thread berhasil diupdate',
      data: updatedId
    })
  }

  async deleteByIdHandler (request) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    const useCase = this._container.getInstance(DeleteThreadByIdUseCase.name)

    const deletedId = await useCase.execute({
      id,
      userId: credentialId
    })

    return HttpResponse.success({
      message: 'thread berhasil dihapus',
      data: deletedId
    })
  }
}

module.exports = ThreadsHandler
