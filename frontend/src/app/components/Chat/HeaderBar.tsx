'use client'

import useStore from '@/store/useStore'
import { MoreVert, Search } from '@mui/icons-material'
import { Typography, useTheme, Stack, Toolbar, AppBar, Avatar, IconButton } from '@mui/material'
import moment from 'moment'
import { useSession } from 'next-auth/react'

const HeaderBar = ({ messages, rounded }: { messages: { message: string; timestamp: number }[]; rounded?: boolean }) => {
  const theme = useTheme()
  const { data: session } = useSession()
  const chats = useStore((state) => state.chats)
  const displayName = useStore((state) => state.displayName)
  const activeChat = useStore((state) => state.activeChat)
  const chat = chats.find((c) => c.id === activeChat)
  const otherUser = chat?.name
    .split(',')
    .filter((m) => m !== 'General' && m !== displayName)
    .join(',')
  const timeFromNow = moment(messages[0]?.timestamp).fromNow()
  const formattedDate = moment(messages[0]?.timestamp).format('DD.MM.YYYY, hh:mm')
  const displayTime = moment().diff(moment(messages[0]?.timestamp), 'days') <= 2 ? timeFromNow : formattedDate
  const lastSender = messages && messages.length ? JSON.parse(messages[messages.length - 1]?.message).author : ''
  return (
    <AppBar position='absolute' sx={{ borderRadius: rounded ? '12px 12px 0 0' : 0 }}>
      <Toolbar>
        {lastSender && lastSender !== 'INTERNAL_SYSTEM_MESSAGE' ? (
          <>
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.primary.contrastText, mr: 2 }}>{lastSender?.charAt(0)}</Avatar>
            <Stack direction='row' justifyContent={'space-between'} alignItems={'flex-end'} width={'100%'}>
              <Typography variant='h6' component='div'>
                {chat?.group ? chat?.name : otherUser}
              </Typography>

              <Stack direction='row' spacing={2} alignItems='center'>
                <Stack direction='column' textAlign={'right'}>
                  <Typography variant='caption' component='div' color={theme.palette.grey[500]}>
                    {lastSender}
                  </Typography>
                  <Typography variant='caption' component='div'>
                    {displayTime}
                  </Typography>
                </Stack>
                <IconButton color='inherit'>
                  <Search />
                </IconButton>
                <IconButton color='inherit'>
                  <MoreVert />
                </IconButton>
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
  )
}

export default HeaderBar
