import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { createDynamoDbClient } from '../../shared/db';
import { handleErrorDdb } from '../../services/ErrorHandlerDdbService';
import { DynamoDB } from 'aws-sdk';
import { formatJsonResponse } from '../../shared/utils';
import { AttributeMap, ScanInput, ScanOutput } from 'aws-sdk/clients/dynamodb';
import { NotFoundError } from '../../exceptions';
import { Product, ProductDTO, Stock } from '../../types/Products';

const { DDB_TABLE_PRODUCTS, DDB_TABLE_STOCKS } = process.env;

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
    console.log('getProductsList event: ' + JSON.stringify(event));

    const dynamoDbClient = createDynamoDbClient();

    const createScanInput = (tableName: string): ScanInput => {
        return {
            TableName: tableName,
            ConsistentRead: false
        }
    }

    const parseOutput = (data: AttributeMap): { [key: string]: any } => {
        return DynamoDB.Converter.unmarshall(data);
    }

    try {
        // bulk request - gets all products using `scan` method
        const scanOutputProducts: ScanOutput = await dynamoDbClient.scan(createScanInput(DDB_TABLE_PRODUCTS)).promise();
        // bulk request - gets all stocks using `scan` method
        const scanOutputStocks: ScanOutput = await dynamoDbClient.scan(createScanInput(DDB_TABLE_STOCKS)).promise();

        // Throws errors it nothing was found
        // Errors below will be logged later in the error handler
        if (scanOutputProducts?.Items?.length === 0) { throw new NotFoundError('Products were not found') };
        if (scanOutputStocks?.Items?.length === 0) throw new NotFoundError('Stocks were not found');

        console.log(`Successful scan request for Products table with output: ${JSON.stringify(scanOutputProducts)}`);
        console.log(`Successful scan request for Stocks table with output: ${JSON.stringify(scanOutputStocks)}`);

        const parsedOutputProducts = scanOutputProducts.Items.map((item: AttributeMap) => parseOutput(item)) as Product[];
        const parsedOutputStocks = scanOutputStocks.Items.map((item: AttributeMap) => parseOutput(item)) as Stock[];

        const responseWithRelations: ProductDTO[] = [];

        parsedOutputProducts.forEach(product => {
            const relatedStock: Stock | undefined = parsedOutputStocks.find((stock: Stock) => stock.product_id === product.id);

            if (relatedStock) responseWithRelations.push(Object.assign(product, relatedStock));
        })

        console.log(`Parsed output for getProductsList request: ${JSON.stringify(parsedOutputProducts)}`)
        return formatJsonResponse(200, responseWithRelations);
    } catch (err) {
        return handleErrorDdb(err);
    }
};
