import { getUserId } from '../utils.mjs'
import { todoData } from '../../dataLayer/todoData.js'
import { S3TodoAttachment } from '../../storageLayer/s3TodoAttachment.js'

export async function handler(event) {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  const s3TodoAttachment = new S3TodoAttachment(todoId)

  const signedUrl = await s3TodoAttachment.GetUploadUrl();
  const signedUrlGet = await s3TodoAttachment.GetDownloadUrl();
  await todoData.updateAttachmentUrl(signedUrlGet, todoId, userId)

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

