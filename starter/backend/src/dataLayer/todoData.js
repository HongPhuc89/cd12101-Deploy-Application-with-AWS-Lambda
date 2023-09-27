import { v4 as uuidv4 } from 'uuid'

import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({});

export class TodoData {
  constructor() {
    this.todosTable = process.env.TODOS_TABLE
  }

  async getUserData(userId) {
    console.log('Get all todo for user: ', userId)
    const params = {
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
        ':userId': { S: userId }
        },
        TableName: this.todosTable
    }
    console.log(params)
    const result = await client.send(new QueryCommand(params))
    console.log(result.Items)
    return result.Items.map((item) => {
        return {
        todoId: item.todoId.S,
        createdAt: item.createdAt.S,
        name: item.name.S,
        dueDate: item.dueDate.S,
        done: item.done.B,
        attachmentUrl: item.attachmentUrl?.S
        }
    })
  }

  async updateData(updatedTodo, todoId, userId) {
    const params = {
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done
      },
      ReturnValues: 'UPDATED_NEW'
    }

    await client.send(new UpdateCommand(params))
  }

  async createData(parsedBody, userId) {
    const itemId = uuidv4()
    const item = {
      todoId: itemId,
      userId: userId,
      createdAt: new Date().toISOString(),
      done: false,
      attachmentUrl: "",
      ...parsedBody
    }

    await client.send(
      new PutCommand({
        TableName: this.todosTable,
        Item: item
      })
    )

    return item
  }

  async deleteData(todoId, userId) {
    const params = {
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      }
    }

    await client.send(new DeleteCommand(params))
  }

  async updateAttachmentUrl(attachmentUrl, todoId, userId) {
    const params = {
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      ExpressionAttributeNames: {
        '#attachmentUrl': 'attachmentUrl'
      },
      UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl,
      }
    }

    await client.send(new UpdateCommand(params))
  }
}

export const todoData = new TodoData()
