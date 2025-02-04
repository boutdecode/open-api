const writer = require('./writers/writer')
const InternalError = require('./errors/internal')

/**
 * @param {ServerResponse} res
 */
module.exports = function (res) {
  Object.defineProperties(res, {
    /**
     * Generate response from route, status and mimetype
     * @param {*} [data=null]
     * @param {number} [status=200]
     * @param {string|null} [statusMessage=null]
     */
    send: {
      value: function (data = null, status = 200, statusMessage = 'Ok') {
        const schema = this.routeMatched?.schema?.output || null
        const mimetype = 'application/json'

        let model = data
        if (schema && !data.error) {
          const { success, data: validatedData, error } = schema.safeParse(data)
          if (!success) {
            throw new InternalError('Invalid response data', error.issues)
          }

          model = validatedData
        }

        writer.write(res, model, mimetype, status || res.statusCode, statusMessage || res.statusMessage)

        res.end()
      }
    }
  })

  return res
}
