import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { createDynamoDbClient } from '../../shared/db';
import { handleErrorDdb } from '../../services/ErrorHandlerDdbService';
import { formatJsonResponse, validateRequest } from '../../shared/utils';
import { schema } from './schema';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../../exceptions';
import { createInput } from './utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('createProduct event: ' + JSON.stringify(event));

    const body = event?.body;
    
    const newId = uuidv4();

    try {
        if (!body) {
            throw new BadRequestError('Body is absent for createProduct request. Required params: description, title, price, count')
        }

        const errors: string[] = validateRequest(schema, JSON.parse(body));

        if (errors.length > 0) {
            throw new BadRequestError(errors.join('; '))
        }

        const dynamoDbClient = createDynamoDbClient();
        await dynamoDbClient.transactWriteItems(createInput(newId, JSON.parse(body))).promise();

        // after successful creation `transactWriteItemsOutput` is empty
        console.info(`Successful transaction request for Product creation with id#${newId}`);

        // send `newIteWithId` just to make it easier to test for reviewers

        return formatJsonResponse(200, { id: newId });
    } catch (err) {
        return handleErrorDdb(err);
    }
};
