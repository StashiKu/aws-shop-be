import { APIGatewayProxyResult } from "aws-lambda";
import * as Joi from "joi";
import { ProductDTO, ProductUI } from "src/types/Products";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatJsonResponse = (statusCode: number, body: {[key: string]: any}): APIGatewayProxyResult => ({
    statusCode,
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
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

export const formatProduct = (product: ProductDTO) => {
    const { 
        ID: id,
        DESCRIPTION: description,
        TITLE: title,
        COUNT: count,
        PRICE: price } = product;

    return { id, description, title, count, price };
}

export const formatProductForDB = (product: ProductUI) => {
  const {
    id: ID,
    description: DESCRIPTION,
    title: TITLE,
    count: COUNT,
    price: PRICE
  } = product;

  return { ID, DESCRIPTION, TITLE, COUNT, PRICE };
}
