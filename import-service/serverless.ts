import type { AWS } from '@serverless/typescript';
import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
        'Fn::ImportValue': 'CatalogItemQueueUrl'
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
        Action: 'S3:ListBucket',
        Resource: 'arn:aws:s3:::product-csv'
      },
      {
        Effect: 'Allow',
        Action: ['S3:*'],
        Resource: 'arn:aws:s3:::product-csv/*'
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::ImportValue': 'CatalogItemQueueArn'
        }
      }
    ]
  },
  // import the function via paths
  functions: { 
    importProductsFile,
    importFileParser
  },
  resources: {
    Resources: {
      GatewayResponseAccessDenied401: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
              'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
              'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
          },
          ResponseType: 'ACCESS_DENIED',
          RestApiId: {
              Ref: 'ApiGatewayRestApi'
          }
        },
      },
      GatewayResponseUnauthorized403: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
              'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
              'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
          },
          ResponseType: 'UNAUTHORIZED',
          RestApiId: {
              Ref: 'ApiGatewayRestApi'
          }
        },
      },
    },
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
    }
  }
};

module.exports = serverlessConfiguration;
