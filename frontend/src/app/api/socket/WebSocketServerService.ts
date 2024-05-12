import { WebSocket, WebSocketServer } from 'ws'

export class WebSocketServerService {
  private server: WebSocketServer | null = null

  public setServer(server: WebSocketServer) {
    this.server = server
  }

  /* not used yet */
  public broadcast(message: string) {
    if (!this.server) {
      throw new Error('WebSocket server not initialized')
    }
    this.server.clients.forEach((currentClient) => {
      currentClient.send(JSON.stringify({ message }))
    })
  }
}
