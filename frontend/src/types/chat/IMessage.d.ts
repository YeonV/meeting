import { IReaction } from './IReaction'

export interface IMessage {
  id: string
  author: string
  content: string
  time?: number
  reactions?: IReaction[]
  recipients?: string[]
  authorAvatar?: string | null
}

export interface IWsMessage {
  author: string
  content: string
  recipients: string[]
  chatId: string
  msgId: string
  authorAvatar: string
}
