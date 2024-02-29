module.exports = {
  validate (data, schema) {
    if (undefined === data || data === null) {
      data = undefined !== schema.default ? schema.default : undefined
    }

    if (typeof data !== 'boolean' && !['true', 'false', '0', '1', 0, 1].includes(data)) {
      throw new Error('Value is not a boolean')
    }

    if (typeof data !== 'boolean') {
      return data === 'true' || data === '1' || data === 1
    }

    return !!data
  },

  parse (data, schema) {
    return this.validate(data, schema)
  }
}
