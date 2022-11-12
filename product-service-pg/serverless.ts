import type { AWS } from '@serverless/typescript';

import {
  getProductsById,
  getProductsList,
  createProduct,
  catalogBatchProcess
} from './src/functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service-2',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      CATALOG_ITEMS_QUEUE_URL: {
        Ref: 'CatalogItemQueue'
      },
      CREATE_PRODUCT_TOPIC_ARN: {
        Ref: 'CreateProductsTopic'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          "lambda:InvokeFunction"
        ],
        Resource: "*"
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::GetAtt': ['CatalogItemQueue', 'Arn']
        }
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'CreateProductsTopic'
        }
      },
    ]
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess
  },
  resources: {
    Resources: {
      CatalogItemQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'CatalogItemQueue2',
          VisibilityTimeout: 720
        }
      },
      CreateProductsTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'CreateProductsTopic2'
        }
      },
      CreateProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'kurushinstas@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'CreateProductsTopic'
          }
        }
      },
      CreateProductsWithPoliciesSubsribtion2: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'stanislav_kurushin@epam.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'CreateProductsTopic'
          },
          // notification will be sent if `count` value is 777
          FilterPolicy: {
            count: [777]
          }
        }
      },
    },
    Outputs: {
      CatalogItemQueueUrl: {
        Value: {
          Ref: 'CatalogItemQueue'
        },
        Export: {
          Name: 'CatalogItemQueueUrl'
        }
      },
      CatalogItemQueueArn: {
        Value: {
          'Fn::GetAtt': ['CatalogItemQueue', 'Arn']
        },
        Export: {
          Name: 'CatalogItemQueueArn'
        }
      }
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
