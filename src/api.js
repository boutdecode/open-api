const { createDocument } = require('zod-openapi')

const assert = require('node:assert')

const compose = require('./compose')
const Middleware = require('./middleware')

const Route = require('./route')
const wrapResponse = require('./response')
const validatePath = require('../middlewares/validate-path')
const validateQuery = require('../middlewares/validate-query')
const validateBody = require('../middlewares/validate-body')
const validateSecurity = require('../middlewares/validate-security')

const defaultGetPath = {
  responses: {
    200: {
      description: 'OK'
    }
  }
}

const defaultPostPath = {
  responses: {
    200: {
      description: 'OK'
    },
    201: {
      description: 'Created'
    },
    400: {
      description: 'Bad Request'
    },
    403: {
      description: 'Forbidden'
    },
    404: {
      description: 'Not Found'
    }
  }
}

const defaultDeletePath = {
  responses: {
    204: {
      description: 'Deleted'
    },
    403: {
      description: 'Forbidden'
    },
    404: {
      description: 'Not Found'
    }
  }
}

/**
 * Core API module of yion
 *
 * @example
 * const { createApi } = require('yion')
 *
 * const app = createApi()
 * app.get('/ping', {}, (req, res) => res.send({message: 'pong'}))
 */
class Api extends Middleware {
  constructor ({ openapi = { info: { version: '1.0.0', title: 'Yion API' } } } = {}) {
    super(null)

    this.middlewares = []
    this.securityMiddlewares = {}
    this.openApi = {
      openapi: '3.0.3',
      ...openapi,
      paths: {},
      components: {
        securitySchemes: {},
        schemas: {}
      }
    }
  }

  get paths () {
    return this.openApi.paths || {}
  }

  get schemas () {
    return this.openApi.components.schemas || {}
  }

  get components () {
    return this.openApi.components || {}
  }

  get securitySchemes () {
    return this.openApi.components.securitySchemes || {}
  }

  addSecurity (name, schema, callback) {
    this.openApi.components.securitySchemes[name] = schema
    this.securityMiddlewares[name] = callback
  }

  addPath (path, options) {
    if (!this.openApi.paths[path]) {
      this.openApi.paths[path] = {}
    }

    const { method } = options
    assert.ok(method, 'Need method')

    delete options.method

    this.openApi.paths[path][method] = {
      ...options
    }

    /** Ordered paths **/
    this.openApi.paths = Object.keys(this.openApi.paths).sort().reduce(
      (obj, key) => {
        obj[key] = this.openApi.paths[key]
        return obj
      },
      {}
    )

    this.openApi = createDocument(this.openApi)
  }

  addSchemas (name, schemas) {
    this.openApi.components.schemas[name] = schemas
  }

  /**
   * Add middleware
   * @param {function} callback
   *
   * @return {Api}
   */
  use (callback) {
    this.middlewares.push(new Middleware(callback))

    return this
  }

  /**
   * Add GET listener middleware
   * @param {string} pattern - the route pattern
   * @param {Object} schemas - the route schemas
   * @param {Function[]} callbacks
   *
   * @return {Api}
   */
  get (pattern, schemas, ...callbacks) {
    const { security, openapi } = schemas
    if (openapi) {
      defaultGetPath.requestParams = schemas.input
      this.addPath(pattern, { method: 'get', ...defaultGetPath, ...openapi })
    }

    const middlewares = [
      security ? validateSecurity(security) : (_, next) => next(),
      validatePath(schemas),
      validateQuery(schemas),
      validateBody(schemas),
      ...callbacks
    ].map(fct => new Middleware(fct))

    this.middlewares.push(new Route('GET', pattern, schemas, middlewares))

    return this
  }

  /**
   * Add POST listener middleware
   * @param {string} pattern - the route pattern
   * @param {Object} schemas - the route schemas
   * @param {Function[]} callbacks
   *
   * @return {Api}
   */
  post (pattern, schemas, ...callbacks) {
    const { security, openapi } = schemas
    if (openapi) {
      const { body } = schemas?.input || {}
      defaultPostPath.requestParams = schemas.input
      if (body) {
        defaultPostPath.requestBody = { content: { 'application/json': { schema: body } } }
      }

      this.addPath(pattern, { method: 'post', ...defaultPostPath, ...openapi })
    }

    const middlewares = [
      security ? validateSecurity(security) : (context, next) => next(),
      validatePath(schemas),
      validateQuery(schemas),
      validateBody(schemas),
      ...callbacks
    ].map(fct => new Middleware(fct))

    this.middlewares.push(new Route('POST', pattern, schemas, middlewares))

    return this
  }

  /**
   * Add DELETE listener middleware
   * @param {string} pattern - the route pattern
   * @param {Object} schemas - the route schemas
   * @param {Function[]} callbacks
   *
   * @return {Api}
   */
  delete (pattern, schemas, ...callbacks) {
    const { security, openapi } = schemas
    if (openapi) {
      defaultDeletePath.requestParams = schemas.input
      this.addPath(pattern, { method: 'delete', ...defaultDeletePath, ...openapi })
    }

    const middlewares = [
      security ? validateSecurity(security) : (context, next) => next(),
      validatePath(schemas),
      validateQuery(schemas),
      validateBody(schemas),
      ...callbacks
    ].map(fct => new Middleware(fct))

    this.middlewares.push(new Route('DELETE', pattern, schemas, middlewares))

    return this
  }

  /**
   * Add PUT listener middleware
   * @param {string} pattern - the route pattern
   * @param {Object} schemas - the route schemas
   * @param {Function[]} callbacks
   *
   * @return {Api}
   */
  put (pattern, schemas, ...callbacks) {
    const { security, openapi } = schemas
    if (openapi) {
      const { body } = schemas?.input || {}
      defaultPostPath.requestParams = schemas.input
      if (body) {
        defaultPostPath.requestBody = { content: { 'application/json': { schema: body } } }
      }

      this.addPath(pattern, { method: 'put', ...defaultPostPath, ...openapi })
    }

    const middlewares = [
      security ? validateSecurity(security) : (context, next) => next(),
      validatePath(schemas),
      validateQuery(schemas),
      validateBody(schemas),
      ...callbacks
    ].map(fct => new Middleware(fct))

    this.middlewares.push(new Route('PUT', pattern, schemas, middlewares))

    return this
  }

  /**
   * Add PATCH listener middleware
   * @param {string} pattern - the route pattern
   * @param {Object} schemas - the route schemas
   * @param {Function[]} callbacks
   *
   * @return {Api}
   */
  patch (pattern, schemas, ...callbacks) {
    const { security, openapi } = schemas
    if (openapi) {
      const { body } = schemas?.input || {}
      defaultPostPath.requestParams = schemas.input
      if (body) {
        defaultPostPath.requestBody = { content: { 'application/json': { schema: body } } }
      }

      this.addPath(pattern, { method: 'patch', ...defaultPostPath, ...openapi })
    }

    const middlewares = [
      security ? validateSecurity(security) : (context, next) => next(),
      validatePath(schemas),
      validateQuery(schemas),
      validateBody(schemas),
      ...callbacks
    ].map(fct => new Middleware(fct))

    this.middlewares.push(new Route('PATCH', pattern, schemas, middlewares))

    return this
  }

  /**
   * @param {Object} context
   * @param {Function} next
   * @param {Array} [args]
   */
  process (context, next, ...args) {
    const { req, res } = context

    context.set('api', this)
    context.set('res', wrapResponse(res))

    req.dispatching = true
    try {
      compose(this.middlewares, context, next)(...args)
    } catch (e) {
      res.send({
        error: e.message || 'Internal server error',
        details: e.details || e.stack || e,
        code: e.code || 500
      },
      e.code || 500,
      e.message || 'Internal server error'
      )
    }
  }
}

module.exports = Api
