export default {
    handler: 'src/handlers/getProductsById/handler.handler',
    events: [
      {
        http: {
          method: 'get',
          path: 'products/{id}',
          cors: 'true',
          queryStringParameters: {
            id: {
              required: true,
              type: 'string',
              description: 'product id'
            }
          },
          responses: {
            200: {
              description: 'successfull API response.',
              bodyType: 'Product',
              type: 'array'
            },
            500: {
              description: 'Internal Server Error.'
            },
            404: {
              description: 'Product with specified id was not found.'
            },
            400: {
              description: 'Please provide an id as path parameter. E.g. products/{id}.'
            }
          }
        }
      }
    ]
  };
  