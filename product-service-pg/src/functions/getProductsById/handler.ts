import { BadRequestError, NotFoundError } from '../../exceptions';
import { handleError } from '../../services/ErrorHandlerService';
import { formatJsonResponse, formatProduct, validateRequest } from '../../shared/utils';
import { schema } from './schema';
import { getDbConfig } from '../../shared/pg_db';
import { Client, QueryResult } from 'pg';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { ProductDTO } from 'src/types/Products';


export const getProductsById: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('getProductsById event: ' + JSON.stringify(event));
  
  const dbConfig = getDbConfig();
  const client = new Client(dbConfig);

  try {
    const id = event?.pathParameters?.id;
  
    if (!id) {
      throw new BadRequestError(`Please provide an id as path parameter. E.g. products/{id}.`);
    }

    await client.connect();
    await client.query('BEGIN');

    const errors: string[] = validateRequest(schema, event.pathParameters);

    if (errors.length > 0) {
      throw new BadRequestError(errors.join('; '))
    }

    const { rows: product }: QueryResult<ProductDTO> = await client.query(`
      SELECT p."ID", p."TITLE", p."DESCRIPTION", p."PRICE", s."COUNT"
      from "Products" p INNER JOIN "Stocks" s
      ON p."ID" = s."PRODUCT_ID"
      WHERE p."ID" = $1
    `, [id]);

    if (product.length === 0) {
      throw new NotFoundError(`Product with id#${id} was not found.`);
    }

    await client.query('COMMIT');

    return formatJsonResponse(200, formatProduct(product[0]));
  } catch (error) {
    console.log(`getProductById event: ${error}`);

    await client.query('ROLLBACK');

    return handleError(error);
  } finally {
    client.end();
  }
};