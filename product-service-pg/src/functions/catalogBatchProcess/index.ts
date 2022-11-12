import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.catalogBatchProcess`,
  timeout: 120,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          'Fn::GetAtt': ['CatalogItemQueue', 'Arn']
        }
      }
    }
  ]
};
