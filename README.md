# Open API tools by Bout de code

![https://boutdecode.fr](https://boutdecode.fr/img/logo.png)

[Bout de code](https://boutdecode.fr) - Développement de site internet et blog avec de vrais morceaux de codes, simples, élégants, utiles (parfois) et surtout sans fioriture.

## Installation

```shell
$ npm install @boutdecode/open-api
```

## Yion plugin

For yion : 

```javascript
OUTDATED !!! README WIP

const { createApp, createServer } = require('@boutdecode/yion')
const { createApi } = require('@boutdecode/open-api')
const openApiDoc = require('@boutdecode/open-api/plugins/open-api-doc')

const app = createApp()
const api = createApi({ openapi: { info: { title: 'My API', version: '1.0.0' } }})
const server = createServer(app, api)

app.use(openApiDoc(api)) // Swagger UI plugin, need API application

const items = [] // Memory storage
api.addSchemas('Item', {
  type: 'object',
  required: ['name', 'description'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' }
  }
})

api.get(
  '/api/items',
  {
    description: 'Get items',
    responses: {
      200: {
        description: 'Items',
        content: {
          'application/json': {
            schema: { type: 'array', items: { $ref: '#/components/schemas/Item' } }
          }
        }
      }
    }
  },
  ({ res }) => {
    res.send(items)
  })

api.post(
  '/api/items',
  {
    description: 'Get items',
    requestBody: {
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Item' }
        }
      }
    }
  },
  ({ req, res }) => {
    const item = req.body
    item.id = randomUUID()
    items.push(item)
    res.send(item)
  })

api.get(
  '/api/items/{id}',
  {
    description: 'Get items',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }
    ],
    responses: {
      200: {
        description: 'Items',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Item' }
          }
        }
      },
      404: {
        description: 'Not found'
      }
    }
  },
  ({ req, res }) => {
    const item = items.find(item => item.id === req.params.id)
    if (!item) {
      res.status(404).send({ message: 'Not found :D' })
    } else {
      res.send(item)
    }
  })

api.delete(
  '/api/items/{id}',
  {
    description: 'Delete items',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }
    ]
  },
  ({ req, res }) => {
    const index = items.findIndex(item => item.id === req.params.id)
    if (index === -1) {
      res.status(404).send({ message: 'Not found' })
    } else {
      items.splice(index, 1)
      res.status(204).send()
    }
  })

server.listen(8080)
```

Every route define with `api.get`, `api.post`, `api.put`, `api.delete` and `api.patch` will be documented by default in the OpenAPI document.

By default, the plugin will serve the Swagger UI on `/api/doc.html` and the OpenAPI document on `/api/doc.json`.

## Tests

```shell
$ npm run test
```
