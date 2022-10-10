import { TransactGetItemsInput } from "aws-sdk/clients/dynamodb";

const { DDB_TABLE_PRODUCTS, DDB_TABLE_STOCKS } = process.env;

export const createInput = (id: string): TransactGetItemsInput => {

    return {
      TransactItems: [
        {
          Get: {
            TableName: DDB_TABLE_PRODUCTS,
            Key: {
              id: {
                S: `${id}`
              }
            }
          }
        },
        {
          Get: {
            TableName: DDB_TABLE_STOCKS,
            Key: {
              product_id: {
                S: `${id}`
              }
            }
          }
        }
      ]
    }
  };