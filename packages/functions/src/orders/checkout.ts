import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const ddb = new AWS.DynamoDB.DocumentClient();

export async function main(event: any) {
  const tableName = process.env.SST_Table_tableName_EcommerceTable!;
  const userId = event.pathParameters?.userId;
  const body = JSON.parse(event.body || "{}");
  const items = body.items || [];

  const orderId = uuidv4();
  const orderDate = new Date().toISOString();

  try {
    for (const item of items) {
      await ddb.put({
        TableName: tableName,
        Item: {
          pk: "USER#" + userId,
          sk: "ORDER#" + orderId + "#PRODUCT#" + item.productId,
          orderId,
          userId,
          productId: item.productId,
          quantity: item.quantity,
          orderDate,
          orderStatus: "CONFIRMED",
        },
      }).promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Order placed successfully", orderId }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Checkout failed" }),
    };
  }
}
