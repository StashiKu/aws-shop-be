
import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { getMockedEvent } from '../test/test.mock';
import { handler } from './handler';

describe('getProdctsById handler', () => {
    it('Should find product by id', async () => {
        const pathParams: APIGatewayProxyEventPathParameters = {
            id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa'
        };
        // get mocked gateaway event with path params
        const event: APIGatewayProxyEvent = getMockedEvent(pathParams);
        const expectedProduct = {
            "count": 4,
            "description": "Short Product Description1",
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
            "price": 2.4,
            "title": "ProductOne"
        };

        // triggers lambda and gets result
        const result: any = await handler(event, null, () => null);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(200);
        expect(body).toEqual(expectedProduct);
    })
});
