export default {
  handler: 'src/handlers/getProductsList/handler.handler',
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: 'true',
        responses: {
          200: {
            description: 'successfull API response',
            bodyType: 'Products',
            type: 'array'
          },
          500: {
            description: 'Internal Server Error'
          }
        }
      }
    }
  ]
};