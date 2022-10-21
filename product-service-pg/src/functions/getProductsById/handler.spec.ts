import { getMockedEvent, productsBEMock } from "@functions/test/data.mock";
import { formatProduct } from "src/shared/utils";
import { getProductsById } from "./handler";

process.env.PG_HOST = 'host';
process.env.PG_PORT = '0000'
process.env.PG_USER = 'user';
process.env.PG_PASSWORD = 'password';
process.env.PG_DB = 'db';

const pathParamMock = {
    id: 'test-uuid'
}

const mockS3Instance = {
    connect: jest.fn(),
    query: jest.fn().mockImplementation(() => ({ rows: [productsBEMock[0]] })),
    end: jest.fn()
}

jest.mock('pg', () => ({
    Client: jest.fn(() => mockS3Instance)
}))

describe('Get Product By Id', () => {
    it('Should return product', async () => {
        const expectedRes = formatProduct(productsBEMock[0])
        const result = await getProductsById(getMockedEvent(pathParamMock), null, () => null);

        if (result) {
            const body = JSON.parse(result.body);

            expect(result.statusCode).toEqual(200);
            expect(body).toEqual(expectedRes);
        }
    });

    it('Should return error if id is not specified', async () => {
        const result = await getProductsById(getMockedEvent({id: null}), null, () => null);
        const expectedError = 'Please provide an id as path parameter. E.g. products/{id}.'

        if (result) {
            const body = JSON.parse(result.body);

            expect(result.statusCode).toEqual(400);
            expect(body.error).toEqual(expectedError);
        }
    });
})
