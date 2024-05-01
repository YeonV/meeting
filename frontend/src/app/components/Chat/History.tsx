'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useWebSocket } from 'next-ws/client'
import { Box, List, ListItem, Typography, useTheme, Stack, Avatar, IconButton, Popover, Divider } from '@mui/material'
import useStore from '@/store/useStore'
import moment from 'moment'
import { IMessage } from '@/types/chat/IMessage'
import PopupState, { bindPopover, bindHover } from 'material-ui-popup-state'
import HoverPopover from 'material-ui-popup-state/HoverPopover'
import { Close, SentimentSatisfiedAlt } from '@mui/icons-material'
import EmojiPicker, { Theme } from 'emoji-picker-react'

const History = ({
  messages,
  setReadMessages,
  emojiOpen,
  group
}: {
  group?: boolean
  messages: IMessage[]
  emojiOpen: boolean
  setReadMessages: Dispatch<
    SetStateAction<
      {
        message: string
        timestamp: number
      }[]
    >
  >
}) => {
  const { data: session } = useSession()
  const chats = useStore((state) => state.chats)
  const addChat = useStore((state) => state.addChat)
  const activeChat = useStore((state) => state.activeChat)
  const setActiveChat = useStore((state) => state.setActiveChat)
  const addReaction = useStore((state) => state.addReaction)
  const [reactionOpen, setReactionOpen] = useState(false)
  const fetchOtherMeetings = useStore((state) => state.fetchOtherMeetings)
  const fetchAllMeetings = useStore((state) => state.fetchAllMeetings)
  const addMessage = useStore((state) => state.addMessage)
  // const me = useStore((state) => state.me)
  const theme = useTheme()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const ws = useWebSocket()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
    // setReadMessages(messages)
  }, [messages])

  // useEffect(() => {
  //   setReadMessages(messages)
  // }, [])
  const openPrivateChat = (recipient: string) => {
    const newId = chats.find((chat) => chat.name === recipient)?.id
    // console.log(session?.user)
    if (newId) {
      // console.log('chat already exists', newId)
      setActiveChat(newId)
    } else {
      // console.log('chat does not exist')
      const newerId = addChat({
        name: recipient,
        group: false,
        messages: [],
        members: [recipient, session?.user?.email || session?.user?.name?.replace('#', '-') || 'Anonymous']
      })
      const msg = JSON.stringify({
        type: 'chat',
        author: 'INTERNAL_SYSTEM_MESSAGE',
        content: 'Chat started!',
        recipients: [recipient, session?.user?.email || session?.user?.name?.replace('#', '-') || 'General'],
        chatId: newerId
      })
      ws?.send(msg)
    }
  }
  return (
    <List sx={{ flexGrow: 1, maxHeight: `calc(100vh - ${emojiOpen ? 834 : 334}px)`, overflow: 'auto', position: 'relative' }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'url(/bg2.png) repeat center center',
          backgroundSize: '70%',
          zIndex: -1,
          opacity: 0.05
        }}
      />
      {messages.map(({ author, content, time, reactions, id }, index) => {
        const isMe = author === session?.user?.email || author === session?.user?.name?.replace('#', '-')
        const align = isMe ? 'flex-end' : 'flex-start'
        const formattedTime = moment(time).format('hh:mm')
        const grey = theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]
        const regex_emoji = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u
        const trimmedContent = content.trim()
        // const hasEmoji = regex_emoji.test(trimmedContent)
        const contentArray = Array.from(trimmedContent)
        // console.log('test all inputs', contentArray, trimmedContent, hasEmoji, regex_emoji.test(trimmedContent))
        const onlyOneEmoji = contentArray.length === 1 && regex_emoji.test(trimmedContent)
        return (
          <ListItem
            key={index}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: align, marginBottom: reactions?.length && reactions.length > 0 ? '1rem' : 0 }}
          >
            {author === 'INTERNAL_SYSTEM_MESSAGE' ? (
              <Stack direction='row' margin={'0 auto'} spacing={2} justifyContent={'center'} alignItems={'center'}>
                <Box
                  sx={{
                    padding: '0.25rem 1rem',
                    borderRadius: '12px',
                    bgcolor: '#3339',
                    color: '#999'
                  }}
                >
                  <Typography>{trimmedContent}</Typography>
                </Box>
              </Stack>
            ) : (
              <Stack direction='row' spacing={2} justifyContent={isMe ? 'flex-end' : 'flex-start'} alignItems={'flex-start'}>
                {!isMe && group && (
                  <Avatar
                    onClick={() => {
                      openPrivateChat(author)
                    }}
                    sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.primary.contrastText, mr: 2, cursor: 'pointer' }}
                  >
                    {author.charAt(0)}
                  </Avatar>
                )}
                <PopupState variant='popover' popupId='demo-popup-popover'>
                  {(popupState) => {
                    // console.log(popupState)
                    // setReactionOpen(false)
                    return (
                      <>
                        <div>
                          <Box
                            sx={{
                              // 'maxWidth': '70%',
                              'padding': '0.75rem 1rem',
                              'mt': 0.5,
                              'borderRadius': isMe ? '12px 0px 12px 12px' : '0px 12px 12px 12px',
                              'bgcolor': isMe ? theme.palette.primary.main : grey,
                              'color': isMe ? theme.palette.primary.contrastText : theme.palette.text.primary,
                              'position': 'relative',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                width: 0,
                                height: 0,
                                borderStyle: 'solid',
                                borderWidth: isMe ? '10px 10px 10px 10px' : '0px 10px 10px 0px',
                                borderColor: isMe
                                  ? `${theme.palette.primary.main} transparent transparent transparent`
                                  : `transparent ${grey} transparent transparent`,
                                top: 0,
                                right: isMe ? '-10px' : 'auto',
                                left: isMe ? 'auto' : '-10px'
                              }
                            }}
                            {...bindHover(popupState)}
                          >
                            {!isMe && (
                              <Typography
                                color={'secondary'}
                                fontSize={18}
                                fontFamily={'Source Sans Pro, sans-serif'}
                                sx={{ cursor: 'pointer' }}
                                fontWeight={600}
                                mb={0.5}
                                onClick={() => group && openPrivateChat(author)}
                              >
                                {author}
                              </Typography>
                            )}
                            <Stack direction='row' spacing={2} justifyContent='flex-end' flexWrap={'wrap'} alignItems={'flex-end'}>
                              <Typography style={{ marginRight: 'auto' }} fontSize={onlyOneEmoji ? 100 : 18} fontFamily={'Source Sans Pro, sans-serif'}>
                                {trimmedContent}
                              </Typography>
                              <div>
                                <Typography fontSize={14} fontFamily={'Source Sans Pro, sans-serif'} sx={{ opacity: 0.7 }}>
                                  {formattedTime}
                                </Typography>
                              </div>
                            </Stack>
                            {reactions?.length! > 0 &&
                              reactions!.map((r: { author: string; emoji: string }, i: number) => (
                                <div key={author + r.emoji + i}>
                                  <Box
                                    key={author + r.emoji + i}
                                    sx={{
                                      bgcolor: isMe ? theme.palette.primary.main : grey
                                      // pointerEvents: 'none'
                                    }}
                                  >
                                    <IconButton
                                      onClick={handleClick}
                                      sx={{
                                        'position': 'absolute',
                                        'right': -16 + i * 42,
                                        'backgroundColor': grey,
                                        '&: hover': {
                                          backgroundColor: grey
                                        },
                                        'border': '1px solid #111',
                                        'padding': 0.5
                                      }}
                                    >
                                      {r.emoji}
                                    </IconButton>
                                  </Box>

                                  <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                      vertical: 'top',
                                      horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'left'
                                    }}
                                    PaperProps={{ style: { borderRadius: '2rem', minWidth: '400px' } }}
                                  >
                                    <Typography sx={{ fontSize: 18, fontWeight: 400, margin: '1.5rem 1.5rem 1rem' }}>Reactions</Typography>
                                    <Divider sx={{ marginBottom: 1 }} />
                                    {reactions?.map((r: { author: string; emoji: string }, i: number) => (
                                      <Stack
                                        flex={1}
                                        spacing={2}
                                        direction={'row'}
                                        alignItems={'center'}
                                        key={author + r.emoji + i}
                                        sx={{ bgcolor: 'transparent', margin: '0 1.5rem 1rem' }}
                                      >
                                        <Stack flex={1} spacing={2} direction={'row'} alignItems={'center'}>
                                          <Avatar>{author.charAt(0)}</Avatar>
                                          <Typography>{r.author}</Typography>
                                        </Stack>
                                        <Typography fontSize={32}>{r.emoji}</Typography>
                                      </Stack>
                                    ))}
                                  </Popover>
                                </div>
                              ))}
                          </Box>
                        </div>

                        <HoverPopover
                          {...bindPopover(popupState)}
                          anchorOrigin={{
                            vertical: 'center',
                            horizontal: isMe ? 'left' : 'right'
                          }}
                          transformOrigin={{
                            vertical: 'center',
                            horizontal: isMe ? 'right' : 'left'
                          }}
                          // onMouseLeave={() => setReactionOpen(false)}
                          PaperProps={{ style: { borderRadius: '2rem', paddingLeft: 16, paddingRight: 16, background: 'transparent' } }}
                        >
                          <Stack direction='row' spacing={1} justifyContent='center' alignItems='center'>
                            <IconButton onClick={() => setReactionOpen(!reactionOpen)}>
                              {reactionOpen ? <Close sx={{ fontSize: '32px' }} /> : <SentimentSatisfiedAlt sx={{ fontSize: '40px' }} />}
                            </IconButton>
                            <EmojiPicker
                              autoFocusSearch
                              reactionsDefaultOpen={true}
                              // style={{ '--epr-emoji-size': '50px' } as any}
                              // emojiStyle={'native' as EmojiStyle}
                              previewConfig={{ showPreview: false }}
                              open={reactionOpen}
                              theme={theme.palette.mode as Theme}
                              onEmojiClick={(e) => {
                                // console.log('emoji clicked', e.emoji, time)
                                addReaction(activeChat, id, {
                                  emoji: e.emoji,
                                  author: session?.user?.email || session?.user?.name?.replace('#', '-') || 'Anonymous'
                                })
                                ws?.send(
                                  JSON.stringify({
                                    type: 'reaction',
                                    chatId: activeChat,
                                    id: id,
                                    reaction: {
                                      author: session?.user?.email || session?.user?.name?.replace('#', '-') || 'Anonymous',
                                      emoji: e.emoji
                                    }
                                  })
                                )
                                /* chatId, messageId, reaction, author */
                                /* chatId: string, messageTime: number, reaction: { author: string; emoji: string } */
                              }}
                              width={'100%'}
                            />
                          </Stack>
                        </HoverPopover>
                      </>
                    )
                  }}
                </PopupState>
              </Stack>
            )}
          </ListItem>
        )
      })}
      <div ref={messagesEndRef} />
    </List>
  )
}

export default History
