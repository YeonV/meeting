export interface IMessage {
  id: string
  author: string
  content: string
  time?: number
  reactions?: { author: string; emoji: string }[]
  recipients?: string[]
}

export interface IWsMessage {
  author: string
  content: string
  recipients: string[]
  chatId: string
  msgId: string
}
