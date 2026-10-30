import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient();

export async function main() {
  const tableName = process.env.SST_Table_tableName_EcommerceTable!;

  try {
    const result = await ddb.scan({
      TableName: tableName,
      FilterExpression: "begins_with(pk, :pk)",
      ExpressionAttributeValues: {
        ":pk": "PRODUCT#",
      },
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (err: unknown) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err instanceof Error ? err.message : "Some error happened",
      }),
    };
  }
}