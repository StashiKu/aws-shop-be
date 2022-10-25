import { APIGatewayProxyResult } from "aws-lambda";
import * as Joi from "joi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatJsonResponse = (statusCode: number, body: {[key: string]: any}): APIGatewayProxyResult => ({
    statusCode,
    body: JSON.stringify(body),
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    }
});

// eslint-disable-next-lint @typescript-eslint/no-explicit-any
export const validateRequest = (schema: Joi.ObjectSchema<any>, objectToValidate: any): string[] => {
    const res = schema.validate(objectToValidate);

    if (res.error) {
      return res.error.details.reduce((accum, curr) => {
        return curr.message ? [...accum, curr.message] : accum
      }, [])
    }

    return [];
  }
