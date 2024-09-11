module.exports = ({
  origin = '*',
  headers = 'X-Requested-With, Content-Type, Accept, Origin, Authorization',
  methods = 'GET, POST, PUT, DELETE, OPTIONS'
} = {}) => {
  return ({ req, res }, next) => {
    res.set('Access-Control-Allow-Origin', origin)
    res.set('Access-Control-Allow-Headers', headers)
    res.set('Access-Control-Allow-Methods', methods)

    if (req.method === 'OPTIONS') {
      return res.send()
    }

    next()
  }
}
