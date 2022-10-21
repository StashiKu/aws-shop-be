import { getMockedEvent, productsBEMock } from "@functions/test/data.mock";
import { formatProduct } from "src/shared/utils";
import { getProductsList } from "./handler";

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


describe('Get Products List', () => {
    it('Should return product', async () => {
        const expectedRes = productsBEMock.map(formatProduct);
        const result = await getProductsList(getMockedEvent(), null, () => null);

        if (result) {
            const body = JSON.parse(result.body);

            expect(result.statusCode).toEqual(200);
            expect(body).toEqual(expectedRes);
        }
    });

    it('Should return error if smth goes wrong', async () => {
        mockS3Instance.query = jest.fn().mockImplementation(() => ({ rows: null }));
        const result = await getProductsList(getMockedEvent(), null, () => null);
        const expectedError = 'Products were not found.'

        if (result) {
            const body = JSON.parse(result?.body);

            expect(result.statusCode).toEqual(404);
            expect(body.error).toEqual(expectedError);
        }
    });
});
