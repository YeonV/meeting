import { NextApiResponse } from 'next'
import { NextRequest } from 'next/server'
import { WebSocketServer } from 'ws'
import { pipeline } from 'stream/promises'
import { Readable, Writable } from 'stream'

export async function POST(req: NextRequest, res: NextApiResponse<any>) {
  if (req.method === 'POST') {
    if (req.headers.get('X-Strapi-NextJS') !== process.env.STRAPI_NEXTJS_SECRET) {
      return new Response('Unauthorized', {
        status: 401
      })
    } 
    const webSocket = (global as any)?.['wsServer'] as WebSocketServer
    const clients: Array<WebSocket> = Array.from((webSocket?.clients || {}) as any)
    // console.log('clients:', clients)
    let data = ''
    await pipeline(
      (req as any).body as Readable,
      new Writable({
        write(chunk, encoding, callback) {
          data += chunk
          callback()
        }
      })
    )
    const message = JSON.parse(data)

    clients.forEach((currentClient) => {
      currentClient.send(JSON.stringify({ type: 'notify', content: message.event, variant: 'info' }))
    })
    return new Response('POST request received', {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } else {
    console.log('Method Not Allowed')
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405
    })
  }
}
