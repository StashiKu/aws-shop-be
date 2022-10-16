# AWS-SHOP-BE
## List of microservices:
 ### 1. [product-service ]  (click to see open api docs)
  Functionality:
  - `getProductById` lambda returns product by id https://arq0plgxm6.execute-api.eu-west-1.amazonaws.com/dev/products/{id}
  - `getProductsList` lambda returns a list of products https://arq0plgxm6.execute-api.eu-west-1.amazonaws.com/dev/products
  - `createProduct` lambda creates new prodct https://arq0plgxm6.execute-api.eu-west-1.amazonaws.com/dev/products
 
 More info:
 - `OpenApi` docs were generated with `serverless-auto-swagger` plugin. Run `sls offline start` to generate docs
 - `Jest` is used for testing. Run `npm run test` to run tests
 - `Webpack`
 - `TypeScript`
 - `dotenv` manages env variables
 - `serverless-dotenv-plugin` automatically upload env variable to environment section in config
 - `es-lint`

 ### 2. import-service
  Functionality:
  - `importFileParser`: uses a readable stream to get an object from S3, parse it using csv-parser package and log each record to be shown in CloudWatch
  - `importProdudctsFile`: creates a new Signed URL with the following key: uploaded/${fileName} https://rr6vcmvbp1.execute-api.eu-west-1.amazonaws.com/dev/import
 
[product-service]: <https://cux94n1pu4.execute-api.eu-west-1.amazonaws.com/swagger>