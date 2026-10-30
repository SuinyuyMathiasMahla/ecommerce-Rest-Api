import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient();

export async function main(event: any) {
  const tableName = process.env.SST_Table_tableName_EcommerceTable!;
  const userId = event.pathParameters?.userId;

  try {
    const result = await ddb.query({
      TableName: tableName,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
      ExpressionAttributeValues: {
        ":pk": "USER#" + userId,
        ":sk": "ORDER#",
      },
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to retrieve order history" }),
    };
  }
}
