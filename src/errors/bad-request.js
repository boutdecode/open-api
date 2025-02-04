const HttpError = require('./http-error')

module.exports = class BadRequestError extends HttpError {
  constructor (message, details = {}, code = 400) {
    super(message, details, code)
  }
}
