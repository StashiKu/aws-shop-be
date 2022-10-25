
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getMockedEvent } from '../test/test.mock';
import { handler } from './handler';

describe('createProduct handler', () => {
    beforeEach(() => {
        process.env.DDB_TABLE_PRODUCTS = 'Products';
        process.env.DDB_TABLE_STOCKS = 'Stocks';
    });

    it('Should validate body params', async () => {
        const mockedbody = {
            description: 123,
            count: 2,
            title: 'title',
            price: 25
        };
        // get mocked gateaway event with path params
        const event: APIGatewayProxyEvent = getMockedEvent(null, null, mockedbody);

        // triggers lambda and gets result
        const result: any = await handler(event, null, () => null);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(400);
        expect(body).toEqual({"error": "\"description\" must be a string"});
    })

    it('Should validate body params', async () => {
        const mockedbody = {
            description: 'test',
            count: 'wront value',
            title: 'title',
            price: 25
        };
        // get mocked gateaway event with path params
        const event: APIGatewayProxyEvent = getMockedEvent(null, null, mockedbody);

        // triggers lambda and gets result
        const result: any = await handler(event, null, () => null);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(400);
        expect(body).toEqual({"error": "\"count\" must be a number"});
    })

    it('Should validate body params', async () => {
        const mockedbody = {
            description: 'test',
            count: 2,
            title: false,
            price: 25
        };
        // get mocked gateaway event with path params
        const event: APIGatewayProxyEvent = getMockedEvent(null, null, mockedbody);

        // triggers lambda and gets result
        const result: any = await handler(event, null, () => null);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(400);
        expect(body).toEqual({"error": "\"title\" must be a string"});
    })
});
