module.exports = class HttpError extends Error {
  constructor (message, details = {}, code = 400) {
    super(message)

    this.details = details
    this.code = code
  }
}
