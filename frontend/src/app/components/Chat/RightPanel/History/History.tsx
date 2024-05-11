'use client'

import { IMessage } from '@/types/chat/IMessage'
import { IReaction } from '@/types/chat/IReaction'
import { useSession } from 'next-auth/react'
import { useWebSocket } from 'next-ws/client'
import { useEffect, useRef } from 'react'
import { List, ListItem, Stack } from '@mui/material'
import PopupState, { bindPopover, bindHover } from 'material-ui-popup-state'
import MessageWrapper from './Message/MessageWrapper'
import MessageAvatar from './Message/MessageAvatar'
import SystemMessage from './Message/SystemMessage'
import ReactionBar from './Message/ReactionBar'
import HistoryBg from './HistoryBg'
import Reaction from './Message/Reaction'
import Message from './Message/Message'
import useStore from '@/store/useStore'
import useTranslation, { formatedDayDate } from '@/lib/utils'

export interface IReactionWithCount extends IReaction {
  count: number
}

const History = ({ messages, emojiOpen, group }: { group?: boolean; messages: IMessage[]; emojiOpen: boolean }) => {
  const ws = useWebSocket()
  const { data: session } = useSession()
  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)

  const chats = useStore((state) => state.chats)
  const addChat = useStore((state) => state.addChat)
  const setActiveChat = useStore((state) => state.setActiveChat)
  const displayName = useStore((state) => state.displayName)
  const activeChat = useStore((state) => state.activeChat)
  const chatId = chats.find((chat) => chat.id === activeChat)?.id || '1'

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [messages])

  const openPrivateChat = (recipient: string) => {
    const newId = chats.find((chat) => chat.name === recipient)?.id
    if (newId) {
      setActiveChat(newId)
    } else {
      const newerId = addChat({
        name: recipient,
        group: false,
        messages: [],
        members: [recipient, displayName]
      })
      setActiveChat(newerId)
      const msg = JSON.stringify({
        type: 'chat',
        author: 'INTERNAL_SYSTEM_MESSAGE',
        content: t('Chat started!'),
        recipients: [recipient, displayName || 'General'],
        chatId: newerId
      })
      ws?.send(msg)
    }
  }

  const sortedMessages = [...messages].sort((a, b) => new Date(a.time!).getTime() - new Date(b.time!).getTime())

  let lastDate = null as string | null

  return (
    <List sx={{ flexGrow: 1, maxHeight: `calc(100vh - ${emojiOpen ? 834 : 334}px)`, overflow: 'auto', position: 'relative' }}>
      <HistoryBg />
      {sortedMessages.map(({ author, content, time, reactions, id }, index) => {
        const isMe = author === displayName
        const align = isMe ? 'flex-end' : 'flex-start'

        const messageDate = formatedDayDate(time, t)
        let dateChangeMessage = null
        if (messageDate !== lastDate) {
          lastDate = messageDate
          dateChangeMessage = <SystemMessage content={messageDate} />
        }

        const groupedReactions =
          reactions &&
          reactions.length! > 0 &&
          reactions?.reduce((grouped, r) => {
            if (!grouped[r.emoji]) {
              grouped[r.emoji] = { ...r, count: 1 }
            } else {
              grouped[r.emoji].count++
            }
            return grouped
          }, {} as Record<string, IReactionWithCount>)
        return (
          <div key={index}>
            {dateChangeMessage}
            <ListItem
              key={index}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: align, marginBottom: reactions?.length && reactions.length > 0 ? '2rem' : 0 }}
            >
              {author === 'INTERNAL_SYSTEM_MESSAGE' ? (
                <SystemMessage content={content} />
              ) : (
                <Stack direction='row' spacing={2} justifyContent={align} alignItems={'flex-start'}>
                  {!isMe && group && <MessageAvatar author={author} onClick={() => openPrivateChat(author)} />}
                  <PopupState variant='popover' popupId='reactions-popover'>
                    {(popupState) => (
                      <>
                        <MessageWrapper minWidth={(reactions?.length || 1) * 30} invert={isMe} {...bindHover(popupState)}>
                          {time && (
                            <Message
                              group={group}
                              invert={isMe}
                              author={author}
                              content={content}
                              time={time}
                              onClick={() => group && openPrivateChat(author)}
                            />
                          )}
                          {groupedReactions &&
                            Object.values(groupedReactions).map((r: IReactionWithCount, i: number) => (
                              <Reaction
                                key={r.author + r.emoji + i}
                                invert={isMe}
                                emoji={r.emoji}
                                i={i}
                                count={r.count}
                                messageId={id}
                                chatId={chatId}
                                reactions={reactions}
                              />
                            ))}
                        </MessageWrapper>
                        <ReactionBar msgId={id} popupState={popupState} bindPopover={bindPopover} invert={isMe} />
                      </>
                    )}
                  </PopupState>
                </Stack>
              )}
            </ListItem>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </List>
  )
}

export default History
