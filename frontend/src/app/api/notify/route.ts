import { NextApiResponse } from 'next'
import { NextRequest } from 'next/server'
import { WebSocketServer } from 'ws'
import { WebSocketServerService } from '../socket/WebSocketServerService'
import { pipeline } from 'stream/promises'
import { Readable, Writable } from 'stream'

export async function POST(req: NextRequest, res: NextApiResponse<any>, webSocketServerService: WebSocketServerService) {
  if (req.method === 'POST') {
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

    console.log('POST request received', message)
    let msg = message
    let variant = 'info'
    if (message.message) {
      msg = message.message
    }
    if (message.variant) {
      variant = message.variant || 'info'
    }

    /* broadcast doesnt work like this yet: */
    // webSocketServerService.broadcast('POST request received')
    /* this one seems to work: */
    clients.forEach((currentClient) => {
      currentClient.send(JSON.stringify({ type: 'notify', content: msg, variant: variant }))
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
