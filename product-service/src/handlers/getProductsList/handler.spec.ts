
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getMockedEvent } from '../test/test.mock';
import { handler } from './handler';
import { products } from '../../data/products';

describe('getProductsList handler', () => {
    it('Should find product by id', async () => {
        // mock gateaway event
        const event: APIGatewayProxyEvent = getMockedEvent();
        // triggers lambda and gets result
        const result: any = await handler(event, null, () => null);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(200);
        expect(body).toEqual(products);
    })
});
