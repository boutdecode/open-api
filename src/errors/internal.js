const HttpError = require('./http-error')

module.exports = class InternalError extends HttpError {
  constructor (message, details, code = 500) {
    super(message, details, code)
  }
}
