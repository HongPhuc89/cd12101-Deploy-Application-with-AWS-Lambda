import { GetObjectCommand, PutObjectCommand, S3Client, } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({region: process.env.S3_REGION})
const bucketName = process.env.ATTACHMENT_S3_BUCKET

export class S3TodoAttachment {
  constructor(todoId) {
    this.todoId = todoId
  }

  async GetUploadUrl() {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: this.todoId
    })
    return await getSignedUrl(s3Client, command,  { expiresIn: 3600 });
  }

  async GetDownloadUrl() {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: this.todoId
    })
    return await getSignedUrl(s3Client, command,  { expiresIn: 36000 });
  }
}
