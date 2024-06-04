import { IMessage } from './IMessage'

export interface IChat {
  id?: string
  name: string
  messages: IMessage[]
  group?: boolean
  members?: string[],
  infos?: { name: string, avatar: string | null | undefined }[]
}
