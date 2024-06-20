'use client'

import { useCallback, useEffect } from 'react'
import { useWebSocket } from 'next-ws/client'
import { IWsMessage } from '@/types/chat/IMessage'
import { useSnackbar } from 'notistack'
import useStore from '@/store/useStore'
import useTranslation from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { v4 as uuidv4 } from 'uuid'
import useAudio from '../components/VideoChat/useAudio'

const WsHandler = ({ children }: { children: React.ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar()

  // const [readMessages, setReadMessages] = useState<{ message: string; timestamp: number }[]>([])
  const chats = useStore((state) => state.chats)
  const addMessage = useStore((state) => state.addMessage)
  const addChat = useStore((state) => state.addChat)
  const updateChatInfo = useStore((state) => state.updateChatInfo)
  const addReaction = useStore((state) => state.addReaction)
  const removeReaction = useStore((state) => state.removeReaction)
  const displayName = useStore((state) => state.displayName)
  const setDisplayName = useStore((state) => state.setDisplayName)
  const language = useStore((state) => state.language)
  const myCallId = useStore((state) => state.myCallId)
  const { data: session } = useSession()
  const { t } = useTranslation(language)
  const setDialogs = useStore((state) => state.setDialogs)
  const setOtherCallId = useStore((state) => state.setOtherCallId)
  const setRinging = useStore((state) => state.setRinging)
  const setOtherAuthorAvatar = useStore((state) => state.setOtherAuthorAvatar)
  const setOtherAuthorName = useStore((state) => state.setOtherAuthorName)
  const setImTheCaller = useStore((state) => state.setImTheCaller);
  const setInCall = useStore((state) => state.setInCall);
  const inCall = useStore((state) => state.inCall)
  // const playDeclined = useAudio('/audio/call/declined.mp3').play
  const playEnd = useAudio('/audio/call/end.mp3').play
  const playMessageIncoming = useAudio('/audio/chat/messageIncoming.mp3').play
  const playMessageOutgoing = useAudio('/audio/chat/messageOutgoing.mp3').play

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
      if (eventType === 'videocall') {
        console.log('incoming call:', JSON.parse(event.data))
        const { callerId, authorAvatar, authorName, otherUser } = JSON.parse(event.data)
        if (myCallId !== callerId) {
          setOtherCallId(callerId)
          setOtherAuthorAvatar(authorAvatar)
          setOtherAuthorName(authorName)
          setImTheCaller(false);
          setRinging(true)
          console.log('setting incomingcall')
        } else {
          setImTheCaller(true);
          setOtherAuthorName(otherUser)
        }
        setDialogs('incomingCall', true)
      }
      if (eventType === 'videocall-accepted') {
        console.log('accepted call:', JSON.parse(event.data))
        const { callerId, authorName } = JSON.parse(event.data)
        if (myCallId !== callerId) {
          setOtherCallId(callerId)
          setOtherAuthorName(authorName)
          console.log('setting incomingcall')
          }
        setInCall(true)
        setDialogs('incomingCall', true)
        setRinging(false)
      }
      if (eventType === 'videocall-rejected') {
        console.log('rejected call:', JSON.parse(event.data), inCall)
        playEnd()
        // if (inCall) {
        //   playEnd()
        // } else {
          // playDeclined()
        // }
        setOtherAuthorName('')
        setDialogs('incomingCall', false)
        setRinging(false)
        // setOtherCallId('')

        setInCall(false)
        setImTheCaller(false)
          ; ((window as any).streamA as MediaStream)?.getTracks().forEach((track) => {
            track.stop()
          })
          ; ((window as any).streamB as MediaStream)?.getTracks().forEach((track) => {
            track.stop()
          })

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
        const { author, content, recipients, chatId, msgId, authorAvatar } = JSON.parse(event.data) as IWsMessage
        console.table({
          author,
          authorAvatar,
          content,
          recipients: recipients?.join(','),
          chatId
        })

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
        if (chats.filter((c) => c.id === chatId).length > 0 && !recipients.includes('General') && author !== displayName) {
          updateChatInfo(chatId, [
            { name: author, avatar: authorAvatar },
            { name: displayName, avatar: session?.user.image }
          ])
        }

        if (content !== `${displayName} ${t('has join the chat')}`) {
          addMessage(chatId || '1', {
            id: msgId,
            author: author || 'Blade',
            authorAvatar: authorAvatar || null,
            content: content,
            reactions: [],
            recipients: recipients
          })
          if (author !== displayName) {
            playMessageIncoming()
            if (document.visibilityState === 'hidden') {
              let notification = new Notification(`${author} ${chats.find((c) => c.id === chatId)?.name !== author ? `in ${chats.find((c) => c.id === chatId)?.name}` : ''}`, {
                body: content,
                icon: authorAvatar || '/favicon.ico'
              })
              notification.onclick = () =>  window.focus()              
            }
          } else {
            playMessageOutgoing()
          }
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
