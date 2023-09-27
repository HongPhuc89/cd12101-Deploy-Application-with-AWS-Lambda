import { todoData } from '../../dataLayer/todoData.js'
import { getUserId } from '../utils.mjs'

export async function handler(event) {
  console.log('Processing event: ', event)
  const userId = getUserId(event)
  const parsedBody = JSON.parse(event.body)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: await todoData.createData(parsedBody, userId)
    })
  }
}
