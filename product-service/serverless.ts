import getProductsList_ddb from './src/handlers/getProductsList_ddb';
import createProduct_ddb from './src/handlers/createProduct_ddb';
import getProductsById_ddb from './src/handlers/getProductsById_ddb';

const serverlessConfiguration = {
  service: 'product-service-ddb',
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-webpack',
    'serverless-offline',
    'serverless-dotenv-plugin'
  ],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: '${env:REGION}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',

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
        Action: [
          "dynamodb: *"
        ],
        Resource: "*"
      }
    ]
  },
  
  // import handler functions via paths
  functions: {
    getProductsById_ddb,
    getProductsList_ddb,
    createProduct_ddb
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      // imports types for autswagger plugin to generate open api docs automatically
      typefiles: ['./src/types/Products.d.ts']
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      // excludes test files
      excludeFiles: '**/*.spec.ts'
    }
  }
};

module.exports = serverlessConfiguration;
