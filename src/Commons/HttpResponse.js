class HttpResponse {
  success ({
    data = undefined,
    message = undefined
  }) {
    return {
      status: 'success',
      data,
      message
    }
  }
}

module.exports = HttpResponse
