const HttpResponse = {
  success (response = {}) {
    const {
      data = undefined,
      message = undefined
    } = response

    return {
      status: 'success',
      data,
      message
    }
  }
}

module.exports = HttpResponse
