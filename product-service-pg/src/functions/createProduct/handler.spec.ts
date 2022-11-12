import { getMockedEvent } from "@functions/test/data.mock";
import { createProduct } from "./handler";
import ProductService from '../../services/ProductService';

process.env.PG_HOST = 'host';
process.env.PG_PORT = '0000'
process.env.PG_USER = 'user';
process.env.PG_PASSWORD = 'password';
process.env.PG_DB = 'db';

jest.mock('../../services/ProductService');

describe('Create Product Handler', () => {
    it('Should create product', async () => {
        const productIdMock = 'uuid-test-id';

        const createProductMock = jest
            .spyOn(ProductService, 'createProduct')
            .mockImplementation(() => Promise.resolve(productIdMock));

        const expectedResult = {message: `Product with id# ${productIdMock} is created SUCCESSFULLY`};

        const result = await createProduct(
            getMockedEvent(null, null, {test: 'test'}),
            null,
            () => null
        );

        if (result) {
            const body = JSON.parse(result.body);
            expect(createProductMock).toHaveBeenCalled();
            expect(result.statusCode).toEqual(200);
            expect(body).toEqual(expectedResult);
        }
    });

    it('Should return error if smth goes wrong', async () => {
        const expectedError = 'test error';
        const createProductMock = jest
            .spyOn(ProductService, 'createProduct')
            .mockImplementation(() => { throw new Error(expectedError) });

        const result = await createProduct(
            getMockedEvent(null, null, {test: 'test'}),
            null,
            () => null
        );

        if (result) {
            const body = JSON.parse(result.body);
            
            expect(createProductMock).toHaveBeenCalled();
            expect(result.statusCode).toEqual(500);
            expect(body.error).toEqual(expectedError);
        }
    });

    it('Should return error if body is abcent', async () => {
        const expectedError = `Body is absent for createProduct request. Required params: description, title, price, count`;
         const result = await createProduct(
            // @ts-ignore
            {pathParameters: { test: 'test'}},
            null,
            () => null
        );

        if (result) {
            const body = JSON.parse(result.body);

            expect(result.statusCode).toEqual(400);
            expect(body.error).toEqual(expectedError);
        }
    });
});
