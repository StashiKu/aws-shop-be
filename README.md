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
 
[product-service]: <https://cux94n1pu4.execute-api.eu-west-1.amazonaws.com/swagger>