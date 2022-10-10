import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from './handler';
import { getMockedEvent } from '../test/test.mock';

describe('getProductById_ddb', () => {
    it('Should return error if path param is absent', async () => {
        const event: APIGatewayProxyEvent = getMockedEvent();

        const result: any = await handler(event, null, () => null);
        const expectedError = {error: 'Please spicify id as a path parameter like path/id. Id should be a string'};
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(400);
        expect(body).toEqual(expectedError);
    });
});
