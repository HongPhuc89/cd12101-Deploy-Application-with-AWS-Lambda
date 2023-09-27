import { getUserId } from '../utils.mjs'
import { todoData } from '../../dataLayer/todoData.js'


export async function handler(event) {
  const userId = getUserId(event)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: await todoData.getUserData(userId)
    })
  }
}
