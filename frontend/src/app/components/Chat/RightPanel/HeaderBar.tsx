'use client'

import useStore from '@/store/useStore'
import { ClearAll, MoreVert, Search } from '@mui/icons-material'
import { Typography, useTheme, Stack, Toolbar, AppBar, Avatar, IconButton, Icon, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import moment from 'moment'
import { useState } from 'react'
import useTranslation from '@/lib/utils'
import DialogDeleteChat from '../../Dialogs/DialogDeleteChat'

const HeaderBar = ({ rounded }: { rounded?: boolean }) => {
  const theme = useTheme()
  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)

  const chats = useStore((state) => state.chats)
  const displayName = useStore((state) => state.displayName)
  const activeChat = useStore((state) => state.activeChat)
  const chat = chats.find((c) => c.id === activeChat)
  const msg = (chat?.messages)?.[(chat?.messages).length - 1]
  const otherUser = chat?.name
    .split(',')
    .filter((m) => m !== 'General' && m !== displayName)
    .join(',')
  const timeFromNow = moment(msg?.time).fromNow()
  const formattedDate = moment(msg?.time).format('DD.MM.YYYY, hh:mm')
  moment.locale(language)
  const displayTime = moment().diff(moment(msg?.time), 'days') <= 2 ? timeFromNow : formattedDate

  const lastSender = msg?.author || ''
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const setDialogs = useStore((state) => state.setDialogs)

  return (
    <AppBar position='absolute' sx={{ borderRadius: rounded ? '12px 12px 0 0' : 0 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
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
      </Toolbar>
    </AppBar>
  )
}

export default HeaderBar
