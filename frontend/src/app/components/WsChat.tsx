'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useWebSocket } from 'next-ws/client'
import useStore from '@/store/useStore'
import { Box, TextField, IconButton, List, ListItem, Typography, Fab, Popover, useTheme, Stack, Toolbar, AppBar, Avatar, Badge, Button } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import moment from 'moment'
import { Chat } from '@mui/icons-material'
// import { clients } from '@/server/actions/_sharedState'

const WsChat = () => {
  const { data: session } = useSession()
  const fetchOtherMeetings = useStore((state) => state.fetchOtherMeetings)
  const fetchAllMeetings = useStore((state) => state.fetchAllMeetings)
  const me = useStore((state) => state.me)
  const theme = useTheme()
  const [inputValue, setInputValue] = useState('' as string)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<{ message: string; timestamp: number }[]>([])
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [readMessages, setReadMessages] = useState<{ message: string; timestamp: number }[]>([])

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const ws = useWebSocket()

  const onMessage = useCallback((event: MessageEvent<string>) => {
    console.log('received message', event.data)
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1]
      if (!lastMessage || lastMessage.message !== event.data) {
        return [...prevMessages, { message: event.data, timestamp: Date.now() }]
      }
      return prevMessages
    })
    if (session && session.strapiToken) {
      console.log('fetching meetings')
      me.role?.type === 'employee' ? fetchAllMeetings(session.strapiToken) : fetchOtherMeetings(session.strapiToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    ws?.addEventListener('message', onMessage)
    return () => ws?.removeEventListener('message', onMessage)
  }, [onMessage, ws])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (open) {
      setReadMessages(messages)
    }
  }, [messages, open])

  const sendMessage = () => {
    if (inputValue !== '') {
      ws?.send(inputValue)
      setInputValue('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  useEffect(() => {
    if (open) {
      setReadMessages(messages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const timeFromNow = moment(messages[0]?.timestamp).fromNow()
  const formattedDate = moment(messages[0]?.timestamp).format('DD.MM.YYYY, hh:mm')
  const displayTime = moment().diff(moment(messages[0]?.timestamp), 'days') <= 2 ? timeFromNow : formattedDate
  const lastSender = messages[messages.length - 1]?.message.split(':')[0]
  return (
    <>
      <Fab onClick={handleClick} color='primary' aria-label='chat' sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Badge badgeContent={messages.length - readMessages.length} color='error' max={99}>
          <Chat />
        </Badge>
      </Fab>
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
          horizontal: 'right'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 800,
            width: 480,
            border: '1px solid gray',
            borderRadius: 2,
            p: 0,
            paddingTop: '64px',
            position: 'relative'
          }}
        >
          <AppBar position='absolute' sx={{ borderRadius: '12px 12px 0 0' }}>
            <Toolbar>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.primary.contrastText, mr: 2 }}>{lastSender?.charAt(0)}</Avatar>

              {lastSender ? (
                <>
                  <Stack direction='row' justifyContent={'space-between'} alignItems={'flex-end'} width={'100%'}>
                    <Typography variant='h6' component='div'>
                      {lastSender}
                    </Typography>
                    <Stack direction='column' textAlign={'right'}>
                      <Typography variant='caption' component='div' color={theme.palette.grey[500]}>
                        Letzte Nachricht
                      </Typography>
                      <Typography variant='caption' component='div'>
                        {displayTime}
                      </Typography>
                    </Stack>
                  </Stack>
                </>
              ) : (
                <Typography variant='h6' component='div'>
                  Chat
                </Typography>
              )}
            </Toolbar>
          </AppBar>
          <List sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
            {messages.map(({ message, timestamp }, index) => {
              const [name, content] = message.split(':')
              const isMe = name === session?.user?.email
              const align = isMe ? 'flex-end' : 'flex-start'
              const formattedTime = moment(timestamp).format('hh:mm')
              const grey = theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]
              return (
                <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: align }}>
                  <Box
                    sx={{
                      'maxWidth': '70%',
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
                        borderColor: isMe ? `${theme.palette.primary.main} transparent transparent transparent` : `transparent ${grey} transparent transparent`,
                        top: 0,
                        right: isMe ? '-10px' : 'auto',
                        left: isMe ? 'auto' : '-10px'
                      }
                    }}
                  >
                    {!isMe && (
                      <Typography color={'secondary'} fontSize={18} fontFamily={'Source Sans Pro, sans-serif'} fontWeight={600} mb={0.5}>
                        {name}
                      </Typography>
                    )}
                    <Stack direction='row' spacing={2} justifyContent='flex-end' flexWrap={'wrap'} alignItems={'flex-end'}>
                      <Typography style={{ marginRight: 'auto' }} fontSize={18} fontFamily={'Source Sans Pro, sans-serif'}>
                        {content}
                      </Typography>
                      <Typography fontSize={14} fontFamily={'Source Sans Pro, sans-serif'} sx={{ opacity: 0.7 }}>
                        {formattedTime}
                      </Typography>
                    </Stack>
                  </Box>
                </ListItem>
              )
            })}
            <div ref={messagesEndRef} />
          </List>
          <Box sx={{ display: 'flex', position: 'relative', padding: 0 }}>
            <AppBar position='sticky' style={{ bottom: 0 }} sx={{ borderRadius: '0 0 12px 12px' }}>
              <Toolbar>
                <TextField
                  placeholder='Gib eine Nachricht ein.'
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  sx={{
                    'flexGrow': 1,
                    'backgroundColor': theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
                    'mr': 1,
                    'borderRadius': '12px',
                    'display': 'flex',
                    'justfyContent': 'center',
                    '& fieldset': { border: 'none', borderRadius: '12px' }
                  }}
                  inputProps={{ style: { height: 12 } }}
                />
                <IconButton disabled={inputValue === ''} onClick={sendMessage} color='primary'>
                  <SendIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
          </Box>
        </Box>
      </Popover>
    </>
  )
}

export default WsChat
