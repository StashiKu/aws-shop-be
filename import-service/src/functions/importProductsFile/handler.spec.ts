import { main } from "./handler";

process.env.BUCKET = 'bucket';
process.env.CATALOG_PATH = 'upload/';
process.env.REGION = 'eu-west-1';

const queryParamMock = 'test.env';
const expectedUrl = process.env.CATALOG_PATH + queryParamMock;
const expectedError = 'File name should be specified like /import?name=fileName';

const mockS3Instance = {
    getSignedUrl: jest.fn().mockImplementation((_action, params) => params.Key),
    promise: jest.fn().mockReturnThis(),
    catch: jest.fn()
};

jest.mock('aws-sdk', () => {
    return { S3: jest.fn(() => mockS3Instance) }
  })

describe('Import products file', () => {
    beforeEach(() => {
        
    });

    it('Should pass init test', async () => {
        const eventMock = {
            queryStringParameters: {
                name: queryParamMock
            }
        };

        const result = await main(eventMock, null, () => null);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(200);
        expect(body.url).toEqual(expectedUrl);
    });

    it('Should return bad request error', async () => {
        const eventMock = {
            queryStringParameters: {
                name: null
            }
        };

        const result = await main(eventMock, null, () => null);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(400);
        expect(body.error).toEqual(expectedError);
    })
})