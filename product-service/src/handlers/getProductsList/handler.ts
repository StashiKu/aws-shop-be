import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { NotFoundError } from '../../exceptions';
import { handleError } from '../../services/ErrorHandlerService';
import { getProducts } from '../../services/ProductService';
import { formatJsonResponse } from '../../shared/utils';
import { Product } from '../../types/Products';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
    console.log('getProductsList event: ' + JSON.stringify(event));
  
    try {
    const products: Product[] = await getProducts();

    if (!products) {
        throw new NotFoundError('Products were not found.');
    }

    return formatJsonResponse(200, products);
    } catch (error) {
        console.log(`getProductsList event: ${error}`);

        handleError(error);
    }
};