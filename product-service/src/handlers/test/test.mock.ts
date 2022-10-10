import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyEventQueryStringParameters } from "aws-lambda";

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
}
