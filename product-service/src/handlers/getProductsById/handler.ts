import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { BadRequestError, NotFoundError } from '../../exceptions';
import { handleError } from '../../services/ErrorHandlerService';
import { getProductById } from '../../services/ProductService';
import { formatJsonResponse } from '../../shared/utils';
import { Product } from '../../types/Products';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('getProductById event: ' + JSON.stringify(event));
  
  const { id } = event.pathParameters;

  if (!id) {
    throw new BadRequestError(`Please provide an id as path parameter. E.g. products/{id}.`);
  }

  try {
    const product: Product = await getProductById(id);

    if (!product) {
      throw new NotFoundError(`Product with id#${id} was not found.`);
    }

    return formatJsonResponse(200, product);
  } catch (error) {
    console.log(`getProductById event: ${error}`);

    handleError(error);
  }
};