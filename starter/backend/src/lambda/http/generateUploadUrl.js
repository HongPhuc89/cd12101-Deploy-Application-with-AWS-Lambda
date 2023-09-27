import { getUserId } from '../utils.mjs'
import { GetObjectCommand, PutObjectCommand, S3Client, } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const s3Client = new S3Client({region: process.env.S3_REGION})
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId
  })

  const signedUrl = await getSignedUrl(s3Client, command,  { expiresIn: 3600 });

  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: todoId
  })
  const signedUrlGet = await getSignedUrl(s3Client, getCommand,  { expiresIn: 3600 });
  const params = {
    TableName: todosTable,
    Key: {
      todoId: todoId,
      userId: userId
    },
    ExpressionAttributeNames: {
      '#attachmentUrl': 'attachmentUrl'
    },
    UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': signedUrlGet,
    }
  }

  await dynamoDbClient.send(new UpdateCommand(params))

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: signedUrl
    })
  }
}

