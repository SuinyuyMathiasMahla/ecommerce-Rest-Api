import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient();

export async function main(event: any) {
  const tableName = process.env.SST_Table_tableName_EcommerceTable!;
  const body = JSON.parse(event.body || "{}");

  const params = {
    TableName: tableName,
    Item: {
      pk: `USER#${body.userId}`,
      sk: `PRODUCT#${body.productId}`,
      productId: body.productId,
      userId: body.userId,
      quantity: body.quantity,
      addedDate: Date.now().toString(),
      cartProductStatus: "PENDING",
    },
  };

  try {
    await ddb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Successfully added product to cart" }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to add to cart" }),
    };
  }
}