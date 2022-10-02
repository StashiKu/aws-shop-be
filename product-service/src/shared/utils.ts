import { APIGatewayProxyResult } from "aws-lambda";

export const formatJsonResponse = (statusCode: number, body: {[key: string]: any}): APIGatewayProxyResult => ({
    statusCode,
    body: JSON.stringify(body),
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
});
