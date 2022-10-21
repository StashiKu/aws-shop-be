import { middyfy } from '@libs/lambda';
import { Handler } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
import { handleError } from '../../services/ErrorHandlerService';
import csv from 'csv-parser';
import { SendMessageRequest } from "aws-sdk/clients/sqs";

const {
  BUCKET,
  REGION,
  CATALOG_PATH,
  COPY_PATH,
  CATALOG_ITEMS_QUEUE_URL
} = process.env;

const s3 = new S3({ region: REGION });
const sqs = new SQS();

const importFileParser: Handler = async (event) => {
  console.log('importFileParser event: ' + JSON.stringify(event));

  const promises = event.Records.map(record => {
    return new Promise<void>((resolve, reject) => {
      const sourcePath = record?.s3?.object?.key;
      const destinationPath = sourcePath.replace(CATALOG_PATH, COPY_PATH);
      const fileName = sourcePath.replace(CATALOG_PATH, '');
      const paramsGetObject = {
        Bucket: BUCKET,
        Key: sourcePath
      };
      const paramsCopyObject = {
        Bucket: BUCKET,
        CopySource: `${BUCKET}/${sourcePath}`,
        Key: destinationPath
      };
      const paramsDeleteObject = {
        Bucket: BUCKET,
        Key: sourcePath
      }

      const res = [];
      const stream = s3.getObject(paramsGetObject).createReadStream();
      stream
        .pipe(csv())
        .on('data', (row) => {
          // if row is empty - skip
          res.push(row);

          const sqsParams: SendMessageRequest = {
            QueueUrl: CATALOG_ITEMS_QUEUE_URL,
            MessageBody: JSON.stringify(row)
          };

          console.log(`sqs parameters are CONFIGURED ${sqsParams}`);

          sqs.sendMessage(sqsParams, (err, result) => {
            if (err) {
              console.log(err);

              reject(err)
            }

            console.log(`Message has been sent to queue SUCCESSFULLY with data: ${result}`);
          });
        })
        .on('error', (error) => {
          console.log(`Error occured while parsing ${paramsGetObject.Key}: ${error}`);
          reject(error);
        })
        .on('end', async () => {
          // copy object
          await s3.copyObject(paramsCopyObject).promise();
          console.log(`File ${fileName} was SUCCESSFULLY copied from '${CATALOG_PATH}' to '${COPY_PATH}' folder`);
          
          // delete object from uploaded/ folder
          await s3.deleteObject(paramsDeleteObject).promise();
          console.log(`File ${fileName} was SUCCESSFULLY removed from '${CATALOG_PATH}' folder`);

          // resolves logs
          resolve()
        })
    });
  });

  try {
    await Promise.all(promises);
  } catch (error) {
    return handleError(error);
  }
};

export const main = middyfy(importFileParser);
