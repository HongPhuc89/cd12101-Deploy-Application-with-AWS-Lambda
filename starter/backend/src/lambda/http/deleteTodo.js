import { getUserId } from '../utils.mjs'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, DeleteCommand } from '@aws-sdk/lib-dynamodb'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  console.log('Processing event: ', event)
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  const params = {
    TableName: todosTable,
    Key: {
      todoId: todoId,
      userId: userId
    }
  }

  await dynamoDbClient.send(new DeleteCommand(params))

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ todoId: todoId })
  }
}
