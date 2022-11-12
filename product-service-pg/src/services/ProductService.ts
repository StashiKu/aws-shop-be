import { BadRequestError } from "src/exceptions";
import { Product, ProductUI } from "src/types/Products";
import { formatProductForDB, validateRequest } from "../shared/utils";
import { schema } from '../functions/createProduct/schema';
import { QueryResult } from "pg";
import { getDbConfig } from "src/shared/pg_db";
import { Client } from 'pg';

export default class ProductService {
  static createProduct = async (data: ProductUI): Promise<string> => {
    const dbConfig = getDbConfig();
    const client = new Client(dbConfig);
  
    const errors: string[] = validateRequest(schema, data);
  
    if (errors.length > 0) {
      throw new BadRequestError(errors.join('; '))
    }
  
    const formattedData = formatProductForDB(data)
    const { TITLE, PRICE, COUNT, DESCRIPTION } = formattedData;
  
    try {
      await client.connect();
      //start transaction
      await client.query('BEGIN');
  
      const { rows: product }: QueryResult<Product> = await client.query(
        `INSERT INTO "Products" ("TITLE", "DESCRIPTION", "PRICE") VALUES ($1, $2, $3) RETURNING "ID"`,
        [TITLE, DESCRIPTION, PRICE]
      );
  
      const productId = product[0].ID;
  
      await client.query(
        `INSERT INTO "Stocks" ("PRODUCT_ID", "COUNT") VALUES ($1, $2)`,
        [productId, COUNT]
      );
  
      await client.query('COMMIT');
  
      return productId;
    } catch (error) {
      await client.query('ROLLBACK');
  
      throw error;
    } finally {
      client.end();
    }
  }
}
