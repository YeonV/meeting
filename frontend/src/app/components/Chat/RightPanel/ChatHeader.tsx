'use client'

import useStore from '@/store/useStore'
import { ChevronLeft, ClearAll, MoreVert, Search, VideoCall } from '@mui/icons-material'
import { Typography, useTheme, Stack, Toolbar, AppBar, Avatar, IconButton, Icon, Menu, MenuItem, ListItemIcon, ListItemText, Box } from '@mui/material'
import moment from 'moment'
import { useState } from 'react'
import useTranslation from '@/lib/utils'
import DialogDeleteChat from '../../Dialogs/DialogDeleteChat'
import { v4 as uuidv4 } from 'uuid'
import { useSession } from 'next-auth/react'
import { useWebSocket } from 'next-ws/client'

const ChatHeader = ({ open, drawerWidth }: { open?: boolean, drawerWidth: string }) => {
  const theme = useTheme()
  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)
  const { data: session } = useSession()

  const ws = useWebSocket()
  const chats = useStore((state) => state.chats)
  const chatDetail = useStore((state) => state.dialogs.chatDetail)
  const displayName = useStore((state) => state.displayName)
  const myCallId = useStore((state) => state.myCallId)
  const activeChat = useStore((state) => state.activeChat)
  const setRinging = useStore((state) => state.setRinging)
  const chat = chats.find((c) => c.id === activeChat)
  const msg = chat?.messages?.[(chat?.messages).length - 1]
  const otherUser = chat?.name
    .split(',')
    .filter((m) => m !== 'General' && m !== displayName)
    .join(',')
  const timeFromNow = moment(msg?.time).fromNow()
  const formattedDate = moment(msg?.time).format('DD.MM.YYYY, hh:mm')
  moment.locale(language)
  const displayTime = moment().diff(moment(msg?.time), 'days') <= 2 ? timeFromNow : formattedDate

  // console.log('MSG:', msg, chat)

  const lastSender = msg?.author || ''
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCall = () => {
    const msg = JSON.stringify({
      type: 'videocall',
      callerId: myCallId,
      recipients: chat?.members || ['General'],
      chatId: chat?.id,
      msgId: uuidv4(),
      authorAvatar: session?.user.image,
      authorName: displayName
    })
    ws?.send(msg)
    setRinging(true)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const setDialogs = useStore((state) => state.setDialogs)
  const setOtherCallId = useStore((state) => state.setOtherCallId);
  const setActiveChat = useStore((state) => state.setActiveChat);

  return (
    <Box position={'relative'} width={open ? `calc(98vw - ${drawerWidth})` : '100vw'}>
  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        {lastSender && lastSender !== 'INTERNAL_SYSTEM_MESSAGE' ? (
          <>
            <Avatar
              onClick={() => setDialogs('chatDetail', !chatDetail)}
              sx={{
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.primary.contrastText,
                mr: 2
              }}
              src={chat?.group ? chat?.name : chat?.infos?.find((c) => c.name === otherUser)?.avatar || undefined}
            >
              {chat?.group ? lastSender?.charAt(0) : otherUser?.charAt(0)}
            </Avatar>
            <Stack direction='row' justifyContent={'space-between'} alignItems={'flex-end'} width={'100%'}>
              <Typography variant='h6' component='div' onClick={() => setDialogs('chatDetail', !chatDetail)}>
                {chat?.group ? chat?.name : otherUser}
              </Typography>

              <Stack direction='row' spacing={2} alignItems='center'>
                <Stack direction='column' textAlign={'right'}>
                  <Typography variant='caption' component='div' color={theme.palette.grey[500]}>
                    {lastSender === displayName ? t('You') : lastSender}
                  </Typography>
                  <Typography variant='caption' component='div'>
                    {displayTime}
                  </Typography>
                </Stack>
                <IconButton color='inherit'>
                  <Search />
                </IconButton>
              </Stack>
            </Stack>
          </>
        ) : (
          <Typography variant='h6' component='div'>
            {t('Chat')}
          </Typography>
        )}
        {!chat?.group && activeChat !== "0" &&(
          <IconButton color='inherit' onClick={handleCall}>
            <VideoCall />
          </IconButton>
        )}
        <IconButton color='inherit' onClick={handleClick}>
          <MoreVert />
        </IconButton>

        <Menu
          keepMounted
          open={menuOpen}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <MenuItem
            onClick={() => {
              setDialogs('deleteChat', true)
              handleMenuClose()
            }}
          >
            <ListItemIcon>
              <ClearAll />
            </ListItemIcon>
            <ListItemText>{t('Cleat all chats')}</ListItemText>
          </MenuItem>
        </Menu>
        <DialogDeleteChat />
    </Stack>
    </Box>
  )
}

export default ChatHeader
