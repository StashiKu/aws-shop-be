import { formatJsonResponse } from "../shared/utils";
import { Exception } from "../types/Exception";

const handleCommonErrors = (err) => {
    switch (err.code) {
        case 'InternalServerError':
            return `Internal Server Error, generally safe to retry with exponential back-off. Error: ${err.message}`;
        case 'ProvisionedThroughputExceededException':
            return `Request rate is too high. If you're using a custom retry strategy make sure to retry with exponential back-off. `
                + `Otherwise consider reducing frequency of requests or increasing provisioned capacity for your table or secondary index. Error: ${err.message}`;
        case 'ResourceNotFoundException':
            return `One of the tables was not found, verify table exists before retrying. Error: ${err.message}`;
        case 'ServiceUnavailable':
            return `Had trouble reaching DynamoDB. generally safe to retry with exponential back-off. Error: ${err.message}`;
        case 'ThrottlingException':
            return `Request denied due to throttling, generally safe to retry with exponential back-off. Error: ${err.message}`;
        case 'UnrecognizedClientException':
            return `The request signature is incorrect most likely due to an invalid AWS access key ID or secret key, fix before retrying. Error: ${err.message}`;
        case 'ValidationException':
            return `The input fails to satisfy the constraints specified by DynamoDB, fix input before retrying. Error: ${err.message}`;
        case 'RequestLimitExceeded':
            return `Throughput exceeds the current throughput limit for your account, `
                + `increase account level throughput before retrying. Error: ${err.message}`;
        case 'InvalidParameterType':
            return err.message;
        case 'BadRequestError':
            return err.message;
        case 'NotFoundError':
            return err.message;
        default:
            return `An exception occurred, investigate and configure retry strategy. Error: ${err.message}`
    }
}

const handleExecuteStatementError = (err) => {
    if (!err) {
        return 'Encountered error object was empty';
    }
    if (!err.code) {
        return `An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(err)}`
    }
    switch (err.code) {
        case 'ConditionalCheckFailedException':
            return `Condition check specified in the operation failed, review and update the condition check before retrying. Error: ${err.message}`;
        case 'TransactionConflictException':
            return `Operation was rejected because there is an ongoing transaction for the item, generally safe to retry ' +
         'with exponential back-off. Error: ${err.message}`;
        case 'ItemCollectionSizeLimitExceededException':
            return `An item collection is too large, you're using Local Secondary Index and exceeded size limit of` +
                `items per partition key. Consider using Global Secondary Index instead. Error: ${err.message}`;
        case 'RelationDoesNotExist':
            return err.message;
        default:
            break;
        // Common DynamoDB API errors are handled below
    }
    return handleCommonErrors(err);
}

export const handleErrorDdb = (err: Exception) => {
    const message: string = handleExecuteStatementError(err);
    const statusCode: number = err.statusCode || 500;

    return formatJsonResponse(statusCode, { error: message });
}
