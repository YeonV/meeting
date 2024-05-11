import { NextApiResponse } from 'next'
import { NextRequest } from 'next/server'
import { WebSocketServer } from 'ws'

export async function POST(req: NextRequest, res: NextApiResponse<any>) {
  if (req.method === 'POST') {
    const webSocket = (global as any)?.['wsServer'] as WebSocketServer
    const clients: Array<WebSocket> = Array.from((webSocket?.clients || {}) as any)
    console.log('clients:', clients)

    console.log('POST request received')
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
