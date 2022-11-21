import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
    service: 'nest-sls',

    plugins: ['serverless-offline', 'serverless-dotenv-plugin'],

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
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
        },
        iamRoleStatements: [
            {
              Effect: 'Allow',
              Action: [
                "lambda:InvokeFunction"
              ],
              Resource: "*"
            }
        ]
    },
    functions: {
        test: {
            handler: 'dist/src/main.handler',
            events: [
                {
                    http: {
                        method: 'ANY',
                        path: '/',
                        cors: true
                    }
                },
                {
                    http: {
                        method: 'ANY',
                        path: '{proxy+}',
                        cors: true
                    }
                }
            ]
        }

    }
}

module.exports = serverlessConfiguration;