import { WebSocket, WebSocketServer } from 'ws'
import { IncomingMessage } from 'http'
import { decrypt } from '@/app/actions'
import { WebSocketServerService } from './WebSocketServerService'

const webSocketServerService = new WebSocketServerService()
export async function SOCKET(client: WebSocket, request: IncomingMessage, server: WebSocketServer) {
  const query = new URLSearchParams(request.url!.split('?')[1])
  const webSocket = (global as any)?.['wsServer'] as WebSocketServer
  const clients: Array<WebSocket> = Array.from(
    (webSocket?.clients || {}) as Set<WebSocket>
  )
  // console.log('clients:', clients)
  client['id'] = decodeURIComponent(query.get('userId') || 'Unknown')

  if (client['id'] === 'Unknown') {
    client.send(
      JSON.stringify({
        author: 'INTERNAL_SYSTEM_MESSAGE',
        content: 'You are not authorized to connect to this server',
      })
    )
    client.close()
    return
  }
  // console.log('client:', client['id'])
  const userStr = client['id'] === 'server' ? client['id'] : await decrypt(client['id'])
  // console.log('userStr:', userStr)
  const user = client['id'] === 'server'
      ? {
          displayName: 'server',
          email: 'server',
          id: 'server',
          name: 'server',
        }
      : JSON.parse(userStr)
  // console.log('user:', user)


  console.log('User connected:', user);
  (client as any).displayName = user.displayName

  const existingNames = Array.from(server.clients).map((c: any) => c.displayName);
  console.log('existing Users:', existingNames)
  // if (existingNames.includes(user.displayName)) {
  //   client.send(JSON.stringify({
  //     type: 'error',
  //     content: 'Display name already in use. Please choose another one.',
  //   }))
  //   client.close()
  //   return
  // }
  // else displayName verified
  

  client.on('message', (payload) => {

    const m = payload instanceof Buffer ? payload.toString() : payload
    const msg = JSON.parse(m as any)

    if (msg.author !== 'INTERNAL_SYSTEM_MESSAGE') {
      msg.author = user.displayName
    }
    console.log('payload:', msg)
    server.clients.forEach((currentClient) => {
      console.log('currentClient:', (currentClient as any).displayName)
      currentClient.send(JSON.stringify(msg))
    })
  })
  ;(global as any)['wsServer'] = server
  webSocketServerService.setServer(server)
}
