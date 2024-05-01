import { WebSocket, WebSocketServer } from 'ws'
import { IncomingMessage } from 'http'

export function SOCKET(client: WebSocket, request: IncomingMessage, server: WebSocketServer) {
  const query = new URLSearchParams(request.url!.split('?')[1])
  const webSocket = (global as any)?.['wsServer'] as WebSocketServer
  const clients: Array<WebSocket> = Array.from((webSocket?.clients || {}) as Set<WebSocket>)

  client['id'] = query.get('userId') ?? 'Unknown'

  // if (clients.length > 1) {
  //   for (const cl of clients) {
  //     // console.log('clients:', cl)
  //     cl.on('message', (message) => {
  //       const m = message instanceof Buffer ? message.toString() : message
  //       for (const c of clients) {
  //         // if (c.id !== cl.id && client.id !== 'server')
  //         c.send(`${client.id}: ${m}`)
  //         // if (client.id !== 'server') c.send(`${client.id}: ${m}`)
  //       }
  //     })
  //   }
  // }

  client.on('message', (payload) => {
    // Send messages to all connected clients, except the sender
    server.clients.forEach((receiver) => {
      // if (receiver === client) return
      const m = payload instanceof Buffer ? payload.toString() : payload
      // const msg = JSON.stringify({
      //   author: client.id,
      //   content: m
      // })
      const msg = JSON.parse(m as any)
      if (msg.author !== 'INTERNAL_SYSTEM_MESSAGE') {
        msg.author = client.id
      }
      receiver.send(JSON.stringify(msg))
    })
  })
  ;(global as any)['wsServer'] = server
}

// // Send messages to all connected clients, except the sender
// console.log('payload:', payload)
// server.clients.forEach((receiver) => {
//   // if (receiver === client) return
//   console.log('receiver:', receiver)
//   const m = payload instanceof Buffer || payload instanceof ArrayBuffer || typeof payload !== 'string' ? payload.toString() : payload
//   console.log(m)
//   const ms = JSON.parse(m)
//   ms.author = client['id']
//   console.log('message:', ms)
//   receiver.send(ms)
// })
