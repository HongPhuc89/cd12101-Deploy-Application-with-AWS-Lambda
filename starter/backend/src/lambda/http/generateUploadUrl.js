import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
const s3Client = new S3Client({region: process.env.S3_REGION})
const bucketName = process.env.ATTACHMENT_S3_BUCKET 

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId
  })

  const signedUrl = await getSignedUrl(s3Client, command,  { expiresIn: 3600 });

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

