import { getUserId } from '../utils.mjs'
import { todoData } from '../../dataLayer/todoData.js'


export async function handler(event) {
  console.log('Processing event: ', event)
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  await todoData.updateData(updatedTodo, todoId, userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ item: updatedTodo })
  }
}
