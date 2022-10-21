import { ProductDTO } from '../../types/Products';
import {
    APIGatewayProxyEvent,
    APIGatewayProxyEventPathParameters,
    APIGatewayProxyEventQueryStringParameters,
    SQSEvent
} from "aws-lambda";

export const productsBEMock: ProductDTO[] = [
    {
      COUNT: 4,
      DESCRIPTION: 'Short Product Description1',
      ID: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
      PRICE: 2.4,
      TITLE: 'ProductOne'
    },
    {
      COUNT: 6,
      DESCRIPTION: 'Short Product Description3',
      ID: '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
      PRICE: 10,
      TITLE: 'ProductNew'
    }
];

export const getMockedEvent = (
    pathParams: APIGatewayProxyEventPathParameters = null,
    queryParams: APIGatewayProxyEventQueryStringParameters =  null,
    body: { [name: string]: any } = {}
): APIGatewayProxyEvent => {
    return {
        body: JSON.stringify(body),
        headers: {},
        multiValueHeaders: {},
        httpMethod: '',
        isBase64Encoded: false,
        path: '',
        pathParameters: pathParams,
        queryStringParameters: queryParams,
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {
            accountId: '',
            apiId: '',
            authorizer: {
                test: ''
            },
            protocol: '',
            httpMethod: '',
            identity: {
                accessKey: null,
                accountId: null,
                apiKey: null,
                apiKeyId: null,
                caller: null,
                clientCert: null,
                cognitoAuthenticationProvider: null,
                cognitoAuthenticationType: null,
                cognitoIdentityId: null,
                cognitoIdentityPoolId: null,
                principalOrgId: null,
                sourceIp: null,
                user: null,
                userAgent: null,
                userArn: null
            },
            path: '',
            stage: '',
            requestId: '',
            requestTimeEpoch: 0,
            resourceId: '',
            resourcePath: ''
        
        },
        resource: ''
    }
};

export const getSQSMockedEvent = (body): SQSEvent => {
    return {
        Records: body.map(item => {
            return ({
                messageId: 'messageId',
                receiptHandle: 'receiptHandle',
                body: JSON.stringify(item),
                attributes: {
                    ApproximateReceiveCount: 'string',
                    SentTimestamp: 'string',
                    SenderId: 'string',
                    ApproximateFirstReceiveTimestamp: 'string'
                },
                messageAttributes: {
                    name: {
                        dataType: 'String'
                    }
                },
                md5OfBody: 'string',
                eventSource: 'string',
                eventSourceARN: 'string',
                awsRegion: 'string'
            });
        })
    }
}
