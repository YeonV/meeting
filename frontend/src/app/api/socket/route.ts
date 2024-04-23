import { WebSocket, WebSocketServer } from 'ws'
import { IncomingMessage } from 'http'

export function SOCKET(client: WebSocket, request: IncomingMessage, server: WebSocketServer) {
  const query = new URLSearchParams(request.url!.split('?')[1])
  const webSocket = (global as any)?.['wsServer'] as WebSocketServer
  const clients: Array<WebSocket> = Array.from((webSocket?.clients || {}) as Set<WebSocket>)

  client['id'] = query.get('userId') ?? 'Unknown'

  if (clients.length > 1) {
    for (const cl of clients) {
      // console.log('clients:', cl)
      cl.on('message', (message) => {
        const m = message instanceof Buffer ? message.toString() : message
        for (const c of clients) {
          // if (c.id !== cl.id && client.id !== 'server')
          c.send(`${client.id}: ${m}`)
          // if (client.id !== 'server') c.send(`${client.id}: ${m}`)
        }
      })
    }
  }

  ;(global as any)['wsServer'] = server
}
