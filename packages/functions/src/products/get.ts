import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient();

export async function main(event: any) {
  const tableName = process.env.SST_Table_tableName_EcommerceTable!;
  const id = event.pathParameters?.productId;

  try {
    const response = await ddb.get({
      TableName: tableName,
      Key: {
        pk: `PRODUCT#${id}`,
        sk: `PRODUCT#${id}`,
      },
    }).promise();

    if (!response.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response.Item),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve product" }),
    };
  }
}