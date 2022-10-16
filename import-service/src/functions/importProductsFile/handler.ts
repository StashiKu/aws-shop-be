import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';
import { BadRequestError } from 'src/exceptions';
import { handleError } from 'src/services/ErrorHandlerService';

import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('importProductsFile event: ' + JSON.stringify(event));

  const { BUCKET, CATALOG_PATH, REGION } = process.env;
  const filename = event?.queryStringParameters?.name;

  try {
    if (!filename) {
      throw new BadRequestError('File name should be specified like /import?name=fileName');
    }

    const s3 = new S3({ region: REGION })
    const params = {
      Bucket: BUCKET,
      Key: CATALOG_PATH + filename,
      Expires: 60,
      ContentType: 'text/csv'
    };

    const url = await s3.getSignedUrl('putObject', params);

    if (!url) {
      throw new Error('Presigned url is faild to create. Please try one more time.')
    }

    return formatJSONResponse(200, { url });
  } catch (error) {
    return handleError(error);
  }
};

export const main = middyfy(importProductsFile);
