import { formatJsonResponse } from '../../shared/utils';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { BadRequestError } from '../../exceptions';
import { handleError } from '../../services/ErrorHandlerService';
import ProductService from '../../services/ProductService';

export const createProduct: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('createProduct event: ' + JSON.stringify(event));
  
  try {
    const body = event?.body;

    if (!body) {
      throw new BadRequestError('Body is absent for createProduct request. Required params: description, title, price, count')
    }

    const parsedBody = JSON.parse(body);

    const productId: string = await ProductService.createProduct(parsedBody);

    return formatJsonResponse(200, {message: `Product with id# ${productId} is created SUCCESSFULLY`});
  } catch (error) {
    console.log(`Error: createProduct event: ${error}`);

    return handleError(error);
  }
};
