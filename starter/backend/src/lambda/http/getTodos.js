import { getUserId } from '../utils.mjs'
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  console.log('Processing event: ', event)
  const userId = getUserId(event)
  console.log('Get all todo for user: ', userId)
  const params = {
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': { S: userId }
    },
    TableName: todosTable
  }

  console.log(params)
  const result = await client.send(new QueryCommand(params))
  const items = result.Items.map((item) => {
    return {
      todoId: item.todoId.S,
      createdAt: item.createdAt.S,
      name: item.name.S,
      dueDate: item.dueDate.S,
      done: item.done.B,
      attachmentUrl: item.attachmentUrl?.S
    }
  })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
