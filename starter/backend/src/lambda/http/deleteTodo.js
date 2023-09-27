import { getUserId } from '../utils.mjs'
import { todoData } from '../../dataLayer/todoData.js'

export async function handler(event) {
  console.log('Processing event: ', event)
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  await todoData.deleteData(todoId, userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ todoId: todoId })
  }
}
