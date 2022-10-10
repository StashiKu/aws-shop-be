export default {
  handler: 'src/handlers/createProduct_ddb/handler.handler',
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: 'true',
        bodyType: 'Product',
        responses: {
          200: {
            description: 'successfull API response'
          },
          500: {
            description: 'Internal Server Error'
          }
        }
      }
    }
  ]
};