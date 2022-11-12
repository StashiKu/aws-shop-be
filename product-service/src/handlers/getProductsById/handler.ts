import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { BadRequestError, NotFoundError } from '../../exceptions';
import { handleError } from '../../services/ErrorHandlerService';
// import { getProductById } from '../../services/ProductService';
import { configureDb } from '../../shared/pg_db';
import { formatJsonResponse, formatProduct } from '../../shared/utils';
// import { Product } from '../../types/Products';
import { Client } from 'pg';

const dbConfig = configureDb();
const clientDb = new Client(dbConfig);

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('getProductById event: ' + JSON.stringify(event));
  
  try {
    const { id } = event?.pathParameters;
  
    if (!id) {
      throw new BadRequestError(`Please provide an id as path parameter. E.g. products/{id}.`);
    }
    const {row: product} = await clientDb.query(`
      SELECT p.ID, p.TITLE, p.DESCRIPTION, p.PRICE, s.COUNT
      from Products p INNER JOIN Stocks s
      ON p.ID = s.PRODUCT_ID
    `)

    if (!product) {
      throw new NotFoundError(`Product with id#${id} was not found.`);
    }

    return formatJsonResponse(200, formatProduct(product));
  } catch (error) {
    console.log(`getProductById event: ${error}`);

    return handleError(error);
  }
};
