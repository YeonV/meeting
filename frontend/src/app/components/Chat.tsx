'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useWebSocket } from 'next-ws/client'
import useStore from '@/store/useStore'
import { Box, Stack } from '@mui/material'
import MessageBar from './Chat/MessageBar'
import HeaderBar from './Chat/HeaderBar'
import History from './Chat/History'
import Userlist from './Chat/Userlist'
import { v4 as uuidv4 } from 'uuid'
import { IWsMessage } from '@/types/chat/IMessage'

const Chat = () => {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<{ message: string; timestamp: number }[]>([])
  const [readMessages, setReadMessages] = useState<{ message: string; timestamp: number }[]>([])
  const [emojiOpen, setEmojiOpen] = useState(false)
  const chats = useStore((state) => state.chats)
  const activeChat = useStore((state) => state.activeChat)
  const addMessage = useStore((state) => state.addMessage)
  const addChat = useStore((state) => state.addChat)
  const addReaction = useStore((state) => state.addReaction)
  const chat = chats.find((c) => {
    return c.id === activeChat
  })

  const ws = useWebSocket()

  const onMessage = useCallback(
    (event: MessageEvent<string>) => {
      const eventType = JSON.parse(event.data).type
      // console.log('event type:', eventType)
      if (eventType === 'reaction') {
        const { chatId, reaction, id } = JSON.parse(event.data)
        if (reaction.author !== session?.user?.email && reaction.author !== session?.user?.name?.replace('#', '-')) {
          addReaction(chatId, id, reaction)
        } else {
        }
      }
      if (eventType === 'chat') {
        const { author, content, recipients, chatId, msgId } = JSON.parse(event.data) as IWsMessage
        console.table({ author, content, recipients: recipients.join(','), chatId })
        const currentUserId = session?.user?.email || session?.user?.name?.replace('#', '-')
        if (recipients && currentUserId && !recipients.includes(currentUserId) && !recipients.includes('General')) {
          return
        }
        if (chats.filter((c) => c.id === chatId).length === 0) {
          addChat({
            id: chatId,
            name: recipients.join(',') || 'General',
            group: recipients.length > 2,
            members: recipients,
            messages: []
          })
        }
        addMessage(chatId || '1', {
          id: msgId,
          author: author || 'Blade',
          content: content,
          reactions: [],
          recipients: recipients
        })
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1]
          if (!lastMessage || lastMessage.message !== event.data) {
            return [...prevMessages, { message: event.data, timestamp: Date.now() }]
          }
          return prevMessages
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chats]
  )

  useEffect(() => {
    ws?.addEventListener('message', onMessage)
    return () => ws?.removeEventListener('message', onMessage)
  }, [onMessage, ws])

  return (
    <>
      <Stack direction={'row'} spacing={0} m={3} flex={1}>
        <Userlist me='YZ' />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minHeight: 500,
            border: '1px solid gray',
            borderLeft: 0,
            p: 0,
            paddingTop: '64px',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1
            }}
          >
            <HeaderBar messages={messages} />
            <History emojiOpen={emojiOpen} setReadMessages={setReadMessages} messages={chat?.messages || []} group={chat?.group} />
            <MessageBar emojiOpen={emojiOpen} setEmojiOpen={setEmojiOpen} />
          </Box>
        </Box>
      </Stack>
    </>
  )
}

export default Chat
