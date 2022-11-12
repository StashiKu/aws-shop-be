import { SQSBatchResponse, SQSHandler } from 'aws-lambda';
import { BadRequestError } from '../../exceptions';
import ProductService from 'src/services/ProductService';
import { SNS } from 'aws-sdk';

const { CREATE_PRODUCT_TOPIC_ARN, REGION } = process.env;

export const catalogBatchProcess: SQSHandler = async (event): Promise<void | SQSBatchResponse> => {
  console.log('catalogBatchProcess event: ' + JSON.stringify(event));
  
  const sns = new SNS({ region: REGION })
 
  try {
    const products = event.Records?.map(record => JSON.parse(record.body));
    
    if (!products) {
      throw new BadRequestError('No records were recieved');
    }

    for (const product of products) {
      try {
        console.log('START product creation');
        const productId = await ProductService.createProduct(product);
        console.log(`Product with id# ${productId} was created SUCCESSFULLY`);

        const params: SNS.Types.PublishInput = {
          Subject: 'Product is created',
          Message: JSON.stringify(product),
          TopicArn: CREATE_PRODUCT_TOPIC_ARN,
          // MessageAttributes is nesessary to specify
          // to make FilterPolicy work
          MessageAttributes: {
            description: {
              DataType: 'String',
              StringValue: product.description
            },
            title: {
              DataType: 'String',
              StringValue: product.title
            },
            count: {
              DataType: 'Number',
              StringValue: product.count
            },
            price: {
              DataType: 'Number',
              StringValue: product.price
            }
          }
        };

        console.log(`SNS message is configured with parameters: ${JSON.stringify(params)}`)
        
        await sns.publish(params).promise();
      } catch (error) {
        console.log(`ERROR: ${error}`);

        const params: SNS.Types.PublishInput = {
          Subject: 'Product FAILED to create',
          Message: JSON.stringify(error),
          TopicArn: CREATE_PRODUCT_TOPIC_ARN
        };

        await sns.publish(params).promise();
      }
    }
  } catch (error) {
    console.log(`Error: catalogBatchProcess event: ${error}`);
  }
};
