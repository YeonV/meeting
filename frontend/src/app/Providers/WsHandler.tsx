'use client'

import { useCallback, useEffect } from 'react'
import { useWebSocket } from 'next-ws/client'
import { IWsMessage } from '@/types/chat/IMessage'
import { useSnackbar } from 'notistack'
import useStore from '@/store/useStore'
import useTranslation from '@/lib/utils'


const WsHandler = ({children}: {children: React.ReactNode}) => {
  const { enqueueSnackbar } = useSnackbar()

  // const [readMessages, setReadMessages] = useState<{ message: string; timestamp: number }[]>([])
  const chats = useStore((state) => state.chats)
  const addMessage = useStore((state) => state.addMessage)
  const addChat = useStore((state) => state.addChat)
  const addReaction = useStore((state) => state.addReaction)
  const removeReaction = useStore((state) => state.removeReaction)
  const displayName = useStore((state) => state.displayName)
  const setDisplayName = useStore((state) => state.setDisplayName)
  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)

  const ws = useWebSocket()

  const onMessage = useCallback(
    (event: MessageEvent<string>) => {
      const eventType = JSON.parse(event.data).type
      console.log('event type:', eventType)

      if (eventType === 'notify') {
        const data = JSON.parse(event.data)
        // console.log(data.variant, data.content)
        enqueueSnackbar(data.content, { variant: data.variant || 'info' })
      }
      if (eventType === 'error') {
        console.log('error:', JSON.parse(event.data))
        if (JSON.parse(event.data).content === 'Display name already in use. Please choose another one.') {
          setDisplayName('')
        }
      }
      if (eventType === 'reaction') {
        const { chatId, reaction, id } = JSON.parse(event.data)
        if (reaction.author !== displayName) {
          addReaction(chatId, id, reaction)
        } else {
        }
      }
      if (eventType === 'reactionRemove') {
        const { chatId, reaction, id } = JSON.parse(event.data)
        console.log('reactionRemove:', chatId, id, reaction)
        if (reaction.author !== displayName) {
          removeReaction(chatId, id, reaction)
        } else {
        }
      }
      if (eventType === 'chat') {
        const { author, content, recipients, chatId, msgId } = JSON.parse(event.data) as IWsMessage
        console.table({ author, content, recipients: recipients?.join(','), chatId })

        if (!recipients.includes(displayName) && !recipients.includes('General')) {
          return
        }
        if (chats.filter((c) => c.id === chatId).length === 0 && !recipients.includes('General')) {
          addChat({
            id: chatId,
            name: recipients.join(',') || 'General',
            group: recipients.length > 2,
            members: recipients,
            messages: []
          })
        }
        if (content !== `${displayName} ${t('has join the chat')}`) {
          addMessage(chatId || '1', {
            id: msgId,
            author: author || 'Blade',
            content: content,
            reactions: [],
            recipients: recipients
          })
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chats]
  )

  useEffect(() => {
    ws?.addEventListener('message', onMessage)
    return () => ws?.removeEventListener('message', onMessage)
  }, [onMessage, ws])

  return children
  
}

export default WsHandler
