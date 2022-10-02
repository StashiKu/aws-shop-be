import getProductsList from './src/handlers/getProductsList';
import getProductsById from './src/handlers/getProductsById';
import * as dotenv from 'dotenv';

dotenv.config();

const {
  STAGE,
  REGION
} = process.env;

const serverlessConfiguration = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-webpack',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: STAGE,
    region: REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import handler functions via paths
  functions: { getProductsList, getProductsById },
  package: { individually: true },
  custom: {
    autoswagger: {
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
