const BadRequestError = require('../src/errors/bad-request')

module.exports = (schema = {}) => (context, next) => {
  const { input } = schema
  if (!input || !input.body) {
    return next()
  }

  const { req } = context
  const { success, data, error } = input.body.safeParse(req.body)
  if (!success) {
    throw new BadRequestError('Invalid "body" input data', error.issues)
  }

  req.body = data

  next()
}
