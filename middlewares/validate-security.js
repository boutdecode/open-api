const BadRequestError = require('../src/errors/bad-request')

function _validateSecurities (context, securitySchema) {
  const { api } = context

  for (const securityName in api.securitySchemes) {
    if (securitySchema[securityName]) {
      const { scheme } = api.securitySchemes[securityName]
      context.set('security', { token: _validateToken(context, scheme), scopes: securitySchema[securityName] })

      return api.securityMiddlewares[securityName](context)
    }
  }

  return false
}

function _validateToken (context, scheme = 'bearer') {
  const { req } = context
  const authorizationHeader = req.headers.authorization
  if (!authorizationHeader) {
    throw new BadRequestError('Need "Authorization" header', 403)
  }

  return authorizationHeader.replace(new RegExp(scheme, 'i'), '').trim()
}

module.exports = (securities = []) => (context, next) => {
  for (const security of securities) {
    if (_validateSecurities(context, security)) {
      return next()
    }
  }

  throw new BadRequestError('Forbidden', 403)
}
