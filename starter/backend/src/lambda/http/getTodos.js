import { getUserId } from '../utils.mjs'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, QueryCommand } from '@aws-sdk/lib-dynamodb'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  console.log('Processing event: ', event)
  const userId = getUserId(event)
  const params = {
    ExpressionAttributeValues: {
      ':userId': {
        S: userId
      }
    },
    KeyConditionExpression: 'userId = :userId',
    TableName: todosTable
  }

  const result = await dynamoDbClient.send(new QueryCommand(params))
  const items = result.Items

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
