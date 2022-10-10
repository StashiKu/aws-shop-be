import { DynamoDB } from 'aws-sdk';
import { ClientConfiguration } from "aws-sdk/clients/acm";

const {
    REGION: region,
    LOCAL_ENDPOINT: local,
    IS_LOCAL_DB: isLocal,
} = process.env;

const params: ClientConfiguration = Number(isLocal) ? { region, endpoint: local } : { region }

export const createDynamoDbClient = (): DynamoDB => {
    return new DynamoDB(params);
}
