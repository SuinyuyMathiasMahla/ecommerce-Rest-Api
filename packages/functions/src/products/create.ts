import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient();

export async function main() {
  const tableName = process.env.SST_Table_tableName_EcommerceTable!;

  const items = [
    {
      category: "fruit",
      createdDate: "2017-03-17T03:06:53 -01:00",
      description: "Reprehenderit aliquip consequat quis excepteur et et esse exercitation adipisicing dolore nulla consequat.",
      modifiedDate: "2019-11-25T12:32:49 -01:00",
      name: "fresh prunes",
      package: { height: 736, length: 567, weight: 41, width: 487 },
      pictures: ["http://placehold.it/32x32"],
      price: 2,
      productId: "a6dd7187-40b6-4cb5-b73c-aecd655c6d9a",
      tags: ["nisi", "quis", "sint", "adipisicing", "pariatur"],
    },
    {
      category: "bakery",
      createdDate: "2017-06-12T09:15:36 -02:00",
      description: "Eu culpa nulla est et anim sint amet.",
      modifiedDate: "2019-08-22T04:22:39 -02:00",
      name: "fresh bread",
      package: { height: 551, length: 976, weight: 47, width: 846 },
      pictures: ["http://placehold.it/32x32"],
      price: 805,
      productId: "b027697d-a070-4c8f-8b9a-b8c80b2eb0ba",
      tags: ["nostrud", "in", "duis", "laboris", "minim"],
    },
  ];

  try {
    for (const item of items) {
      await ddb.put({
        TableName: tableName,
        Item: {
          pk: `PRODUCT#${item.productId}`,
          sk: `PRODUCT#${item.productId}`,
          ...item,
        },
      }).promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Products loaded successfully" }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not load products" }),
    };
  }
}