import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{id}',
        cors: true,
        request: {
          parameters: {
            paths: {
              id: true
            }
          }
        }
      }
    }
  ]
};
