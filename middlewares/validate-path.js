const BadRequestError = require('../src/errors/bad-request')

module.exports = (schema = {}) => (context, next) => {
  const { input } = schema
  if (!input || !input.path) {
    return next()
  }

  const { req } = context
  const { success, data, error } = input.path.safeParse(req.params)
  if (!success) {
    throw new BadRequestError('Invalid "path" input data', error.issues)
  }

  req.params = data

  next()
}
