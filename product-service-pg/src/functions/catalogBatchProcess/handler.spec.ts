import { productsBEMock, getSQSMockedEvent } from "@functions/test/data.mock";
import { formatProduct } from "src/shared/utils";
import { catalogBatchProcess } from "./handler";
import ProductService from '../../services/ProductService';

process.env.PG_HOST = 'host';
process.env.PG_PORT = '0000'
process.env.PG_USER = 'user';
process.env.PG_PASSWORD = 'password';
process.env.PG_DB = 'db';
process.env.REGION = 'eu-west-1';
process.env.CREATE_PRODUCT_TOPIC_ARN = 'test-topic';

const mockSQSInstance = {
    publish: jest.fn()
}

jest.mock('aws-sdk', () => ({
    SNS: jest.fn(() => mockSQSInstance)
}));

jest.mock('../../services/ProductService');

describe('Catalog Patch', () => {
    beforeEach(() => {
        mockSQSInstance.publish.mockClear();
    })
    it('Should send successfull notification', async () => {
        const productIdMock = 'uuid-test-id';

        const createProductMock = jest
            .spyOn(ProductService, 'createProduct')
            .mockImplementation(() => Promise.resolve(productIdMock));

        await catalogBatchProcess(
            getSQSMockedEvent(productsBEMock.map(formatProduct)),
            null,
            () => null
        );

        expect(mockSQSInstance.publish).toHaveBeenCalled();
        expect(createProductMock).toHaveBeenCalled();
    });

    it('Should send failed notification', async () => {
        const expectedError = 'test error';
        const createProductMock = jest
            .spyOn(ProductService, 'createProduct')
            .mockImplementation(() => Promise.reject(expectedError));

        const expectedSQSParams = {
            Subject: 'Product FAILED to create',
            Message: JSON.stringify(expectedError),
            TopicArn: undefined
        };

        await catalogBatchProcess(
            getSQSMockedEvent(productsBEMock.map(formatProduct)),
            null,
            () => null
        );

        expect(createProductMock).toHaveBeenCalled();
        expect(mockSQSInstance.publish).toHaveBeenCalledWith(expectedSQSParams);
    })
});
