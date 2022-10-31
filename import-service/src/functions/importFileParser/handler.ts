import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { handleError } from 'src/services/ErrorHandlerService';
import csv from 'csv-parser';

const importFileParser: Handler = async (event) => {
  console.log('importFileParser event: ' + JSON.stringify(event));
  
  const { BUCKET, REGION, CATALOG_PATH, COPY_PATH } = process.env;
  
  const promises = event.Records.map(record => {
    return new Promise((resolve, reject) => {
      const s3 = new S3({ region: REGION });
      const sourcePath = record?.s3?.object?.key;
      const destinationPath = sourcePath.replace(CATALOG_PATH, COPY_PATH);
      const fileName = sourcePath.replace(CATALOG_PATH, '');
      const paramsGetObject = {
        Bucket: BUCKET,
        Key: sourcePath
      };
      const paramsCopyObject = {
        Bucket : BUCKET,
        CopySource : `${BUCKET}/${sourcePath}`,
        Key: destinationPath,
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
          if (Object.values(row).some(item => item)) {
            res.push(row);
          }
        })
        .on('error', (error) => {
          console.log(`Error occured while parsing ${paramsGetObject.Key}: ${error}`);
          reject(error);
        })
        .on('end', async () => {
          console.log(`Data was parsed from ${paramsGetObject.Key}: ${JSON.stringify(res)}`);
          // copy object
          await s3.copyObject(paramsCopyObject).promise()
            .then(() => {
              console.log(`File ${fileName} was SUCCESSFULLY copied from '${CATALOG_PATH}' to '${COPY_PATH}' folder`);
              // delete object from uploaded/ folder
              return s3.deleteObject(paramsDeleteObject).promise()
            })
            .then(() => {
              console.log(`File ${fileName} was SUCCESSFULLY removed from '${CATALOG_PATH}' folder`);
              // resolves logs
              resolve(res)
            })
        })
    });
  });

  const response = await Promise.all(promises);

  try {
    return formatJSONResponse(200, { response });
  } catch (error) {
    return handleError(error);
  }
};

export const main = middyfy(importFileParser);
