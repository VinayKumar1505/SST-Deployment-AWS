import { Table } from "sst/node/table";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(
  new DynamoDBClient({})
);

export async function handler(event: any) {
  const body = JSON.parse(event.body);

  await client.send(
    new PutCommand({
      TableName: Table.Contacts.tableName,
      Item: {
        id: crypto.randomUUID(),
        name: body.name,
        email: body.email,
        message: body.message,
        createdAt: new Date().toISOString(),
      },
    })
  );

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      success: true,
    }),
  };
}