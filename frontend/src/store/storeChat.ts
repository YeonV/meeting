import type { IStore } from './useStore'
import { produce } from 'immer'
import { IChat } from '@/types/chat/iChat'
import { IMessage } from '@/types/chat/IMessage'
import { v4 as uuidv4 } from 'uuid'

const storeChat = (set: any, get: any) => ({
  activeChat: '1',
  setActiveChat: (chatName: string): void =>
    set(
      produce((state: IStore) => {
        state.activeChat = chatName
      }),
      false,
      'chat/setActiveChat'
    ),
  chats: [
    {
      id: '1',
      name: 'General',
      group: true,
      messages: [
        {
          id: uuidv4(),
          author: 'INTERNAL_SYSTEM_MESSAGE',
          content: 'Welcome!',
          time: +new Date(),
          reactions: [],
          recipients: ['General']
        }
      ]
    }
  ] as IChat[],
  getChatIdByMembers: (members: string[]): string | undefined => {
    const chats = (get() as IStore).chats
    const chat = chats.find((c) => c.members?.every((m) => members.includes(m)))
    // console.log('members:', members, chats, chat)
    return chat?.id
  },
  setChats: (chats: IChat[]): void =>
    set(
      produce((state: IStore) => {
        state.chats = chats
      }),
      false,
      'chat/setChats'
    ),
  addChat: (chat: IChat): string => {
    if (!chat.id) chat.id = uuidv4()
    set(
      produce((state: IStore) => {
        state.activeChat = chat.id!
      }),
      false,
      'chat/setActiveChat'
    )

    set(
      produce((state: IStore) => {
        state.chats.push(chat)
      }),
      false,
      'chat/addChat'
    )
    return chat.id
  },
  removeChat: (chatName: string): void =>
    set(
      produce((state: IStore) => {
        state.chats = state.chats.filter((chat) => chat.name !== chatName)
      }),
      false,
      'chat/removeChat'
    ),
  clearChats: (): void =>
    set(
      produce((state: IStore) => {
        state.chats = []
      }),
      false,
      'chat/clearChats'
    ),
  updateChat: (chat: IChat): void =>
    set(
      produce((state: IStore) => {
        state.chats = state.chats.map((c) => (c.name === chat.name ? chat : c))
      }),
      false,
      'chat/updateChat'
    ),
  addMessage: (chatId: string, message: IMessage): void => {
    message.time = new Date().getTime()
    return set(
      produce((state: IStore) => {
        state.chats = state.chats.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, message] } : c))
      }),
      false,
      'chat/addMessage'
    )
  },
  clearMessages: (chatName: string): void =>
    set(
      produce((state: IStore) => {
        state.chats = state.chats.map((c) => (c.name === chatName ? { ...c, messages: [] } : c))
      }),
      false,
      'chat/clearMessages'
    ),
  updateMessage: (chatName: string, message: IMessage): void =>
    set(
      produce((state: IStore) => {
        state.chats = state.chats.map((c) => (c.name === chatName ? { ...c, messages: c.messages.map((m) => (m.id === message.id ? message : m)) } : c))
      }),
      false,
      'chat/updateMessage'
    ),
  removeMessage: (chatName: string, messageId: string): void =>
    set(
      produce((state: IStore) => {
        state.chats = state.chats.map((c) => (c.name === chatName ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) } : c))
      }),
      false,
      'chat/removeMessage'
    ),
  addReaction: (chatId: string, messageId: string, reaction: { author: string; emoji: string }): void =>
    set(
      produce((state: IStore) => {
        state.chats = state.chats.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: c.messages.map((m) => (m.id === messageId ? { ...m, reactions: m.reactions ? [...m.reactions, reaction] : [reaction] } : m))
              }
            : c
        )
      }),
      false,
      'chat/addReaction'
    )
})

export default storeChat
