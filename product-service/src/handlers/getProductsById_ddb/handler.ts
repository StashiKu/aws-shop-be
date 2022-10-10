import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { createDynamoDbClient } from '../../shared/db';
import { handleErrorDdb } from '../../services/ErrorHandlerDdbService';
import { formatJsonResponse, validateRequest } from '../../shared/utils';
import { TransactGetItemsInput, TransactGetItemsOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoDB } from 'aws-sdk';
import RelationDoesNotExistError from '../../exceptions/RelationDoesNotExistError';
import { BadRequestError } from '../../exceptions';
import { schema } from './schema';
import { createInput } from './utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('getProductById event: ' + JSON.stringify(event));

  try {
    const id = event?.pathParameters?.id;

    if (!id) {
      throw new BadRequestError('Please spicify id as a path parameter like path/id. Id should be a string')
    }

    const errors: string[] = validateRequest(schema, event.pathParameters);

    if (errors.length > 0) {
      throw new BadRequestError(errors.join('; '))
    }

    const transactGetItemsInput: TransactGetItemsInput = createInput(id);
    const dynamoDbClient: DynamoDB = createDynamoDbClient();
    const transactGetItemsOutput: TransactGetItemsOutput = await dynamoDbClient.transactGetItems(transactGetItemsInput).promise();

    console.log(`Successful TransactGetItems request with output: ${JSON.stringify(transactGetItemsOutput)}`);

    const parsedOutput: { [key: string]: any } = transactGetItemsOutput.Responses.map(output => {
      if (output.Item) {
        return DynamoDB.Converter.unmarshall(output.Item)
      }

      return null
    });

    // item with particular id might be abcent in one of the table
    const doesRelationExist: boolean = !parsedOutput.includes(null);

    if (!doesRelationExist) {
      console.error(`Relation for id# ${event.pathParameters.id} does not exist`);
      throw new RelationDoesNotExistError(`Relation for id# ${event.pathParameters.id} does not exist`);
    }

    return formatJsonResponse(200, Object.assign(parsedOutput[0], parsedOutput[1]));
  } catch (err) {
    return handleErrorDdb(err);
  }
}
