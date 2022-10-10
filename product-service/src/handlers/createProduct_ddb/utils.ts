import { TransactWriteItemsInput } from "aws-sdk/clients/dynamodb";

const { DDB_TABLE_PRODUCTS, DDB_TABLE_STOCKS } = process.env;

export const createInput = (newId: string, body: {[name: string]: any}): TransactWriteItemsInput => {
    const { description, title, price, count } = body;

    return {
        TransactItems: [
            {
                Put: {
                    TableName: DDB_TABLE_PRODUCTS,
                    Item: {
                        id: {
                            S: newId
                        },
                        description: {
                            S: description || ''
                        },
                        title: {
                            S: title
                        },
                        price: {
                            N: `${price}`
                        }
                    },
                    ConditionExpression: 'attribute_not_exists(#d1650)',
                    ExpressionAttributeNames: {
                        '#d1650': 'id'
                    }
                }
            },
            {
                Put: {
                    TableName: DDB_TABLE_STOCKS,
                    Item: {
                        product_id: {
                            S: newId
                        },
                        count: {
                            N: `${count}`
                        }
                    },
                    ConditionExpression: 'attribute_not_exists(#668a0)',
                    ExpressionAttributeNames: {
                        '#668a0': 'product_id'
                    }
                }
            }
        ]
    }
}
