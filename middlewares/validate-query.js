const BadRequestError = require('../src/errors/bad-request')

module.exports = (schema = {}) => (context, next) => {
  const { input } = schema
  if (!input || !input.query) {
    return next()
  }

  const { req } = context
  const { success, data, error } = input.query.safeParse(req.query)
  if (!success) {
    throw new BadRequestError('Invalid "query" input data', error.issues)
  }

  req.query = data

  next()
}
