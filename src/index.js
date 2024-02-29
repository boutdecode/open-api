const Api = require('./api')

module.exports = {
  createApi: (options) => new Api(options)
}
