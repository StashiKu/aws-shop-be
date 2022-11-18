import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        authorizer: {
          name: 'basicAuth',
          arn: 'arn:aws:lambda:eu-west-1:${aws:accountId}:function:authorization-service-dev-basicAuthorizer',
          identitySource: 'method.request.header.Authorization',
          resultTtlInSeconds: 0
        },
        request: {
          parameters: { querystrings: { name: true }}
        }
      }
    }
  ]
};
