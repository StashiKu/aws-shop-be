import { productsBEMock } from "@functions/test/data.mock";
import { formatProduct } from "src/shared/utils";
import { ProductUI } from "src/types/Products";
import ProductService from "./ProductService";

process.env.PG_HOST = 'host';
process.env.PG_PORT = '0000'
process.env.PG_USER = 'user';
process.env.PG_PASSWORD = 'password';
process.env.PG_DB = 'db';

const mockS3Instance = {
    connect: jest.fn(),
    query: jest.fn().mockImplementation(() => ({ rows: productsBEMock })),
    end: jest.fn()
}

jest.mock('pg', () => ({
    Client: jest.fn(() => mockS3Instance)
}));


describe('Product Service', () => {
  const productRecievedFromFe: ProductUI = formatProduct(productsBEMock[0]);
  const { title, description, price, id, count } = productRecievedFromFe;
    it('Should create record in the Products table', async () => {
        const expectedArgSqlQueryForProductsTable = `INSERT INTO "Products" ("TITLE", "DESCRIPTION", "PRICE") VALUES ($1, $2, $3) RETURNING "ID"`;
        const expectedArgWithQueryArgsForProductsTable = [title, description, price];
        const expectedArgSqlQueryForPStocksTable = `INSERT INTO "Stocks" ("PRODUCT_ID", "COUNT") VALUES ($1, $2)`
        const expectedArgWithQueryArgsForPStocksTable = [id, count];

        await ProductService.createProduct({ title, description, price, count });

        expect(mockS3Instance.query).toHaveBeenNthCalledWith(2, expectedArgSqlQueryForProductsTable, expectedArgWithQueryArgsForProductsTable);
        expect(mockS3Instance.query).toHaveBeenNthCalledWith(3, expectedArgSqlQueryForPStocksTable, expectedArgWithQueryArgsForPStocksTable);
        expect(mockS3Instance.query).toHaveBeenCalledTimes(4);
        expect(mockS3Instance.end).toHaveBeenCalledTimes(1);
    });

    it('Should throw error if product data is invalid', async () => {
      const invalidData = {
        title: 123,
        description: 'test',
        price: 25,
        count: 1
      };

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await ProductService.createProduct(invalidData);
      } catch (error) {
        expect(error.message).toEqual('"title" must be a string');
      }
    });
});
