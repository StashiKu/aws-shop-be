import { getDbConfig } from '../../shared/pg_db';
import { Client } from 'pg';
import { formatJsonResponse, formatProduct } from '../../shared/utils';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { NotFoundError } from '../../exceptions';
import { handleError } from '../../services/ErrorHandlerService';

export const getProductsList: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('getProductsList event: ' + JSON.stringify(event));
  
  const dbConfig = getDbConfig();
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    // start transaction
    await client.query('BEGIN');

    const { rows: products } = await client.query(`
        SELECT p."ID", p."TITLE", p."DESCRIPTION", p."PRICE", s."COUNT"
        FROM "Products" p INNER JOIN "Stocks" s
        ON p."ID" = s."PRODUCT_ID"
      `);

    if (!products) {
      throw new NotFoundError('Products were not found.');
    }

    await client.query('COMMIT');

    return formatJsonResponse(
      200,
      products.map(formatProduct)
    );
  } catch (error) {
    console.log(`Error: getProductsList event: ${error}`);

    await client.query('ROLLBACK');

    return handleError(error);
  } finally {
    client.end();
  }
};
