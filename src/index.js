const { z } = require('zod')
const { extendZodWithOpenApi } = require('zod-openapi')
const Api = require('./api')

extendZodWithOpenApi(z)

module.exports = {
  createApi: (options) => new Api(options)
}

module.exports.createApi = (options) => new Api(options)
module.exports.z = z
