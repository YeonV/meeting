'use client'

import { useState, MouseEvent } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Avatar, Divider, ListItemIcon, ListItemText, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material'
import {
  AdminPanelSettings,
  Brightness4,
  Brightness7,
  CalendarToday,
  Chat,
  DeveloperBoard,
  Edit,
  List,
  Login,
  Logout,
  MessageRounded,
  VideoChat,
  Visibility
} from '@mui/icons-material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import useStore from '@/store/useStore'
import { useHotkeys } from 'react-hotkeys-hook'
import Image from 'next/image'
import { IMe } from '@/types/meeting/IMe'
import { useSnackbar } from 'notistack'
import LocaleSelector from './LocalSelector'
import useTranslation from '@/lib/utils'

const TopBarBase = () => {
  const { data: session } = useSession()
  const theme = useTheme()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const darkMode = useStore((state) => state.darkMode)
  const setDarkMode = useStore((state) => state.setDarkMode)
  const dev = useStore((state) => state.dev)
  const me = useStore((state) => state.me)
  const setDev = useStore((state) => state.setDev)
  const currentTab = useStore((state) => state.currentTab)
  const setCurrentTab = useStore((state) => state.setCurrentTab)
  const setMeetings = useStore((state) => state.setMeetings)
  const setOtherMeetings = useStore((state) => state.setOtherMeetings)
  const displayName = useStore((state) => state.displayName)
  const setDisplayName = useStore((state) => state.setDisplayName)
  const setMe = useStore((state) => state.setMe)
  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  useHotkeys('ctrl+alt+y', () => setDev(true))

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed' color='inherit'>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction='row' spacing={2} alignItems={'center'}>
            {session && session.user ? (
              <Tabs
                value={currentTab}
                onChange={(event: React.SyntheticEvent, newValue: number) => {
                  setCurrentTab(newValue)
                }}
              >
                <Tab
                  iconPosition='start'
                  icon={<Image src={darkMode ? '/icon.png' : '/icon-with-bg.png'} alt='logo' width={40} height={40} />}
                  value={0}
                  label=''
                />
                <Tab iconPosition='start' icon={<CalendarToday />} value={1} label={t('Calendar')} />
                <Tab iconPosition='start' icon={<List />} value={2} label={t('Meetings')} />
                <Tab iconPosition='start' icon={<Chat />} value={3} label={t('Chat')} />
                <Tab iconPosition='start' icon={<VideoChat />} value={3} label={t('Video-Chat')} />
                {(me.role?.type === 'privileged' || me.role?.type === 'administrator') && (
                  <Tab iconPosition='start' icon={<AdminPanelSettings />} value={4} label={t('Admin')} />
                )}
              </Tabs>
            ) : (
              <>
                <Image src={darkMode ? '/icon.png' : '/icon-with-bg.png'} alt='logo' width={40} height={40} style={{ marginRight: '1rem' }} />
                <Typography variant='h6'>AppStack</Typography>
              </>
            )}
          </Stack>

          <Stack direction='row' spacing={2} alignItems={'center'}>
            {dev && (
              <IconButton color='inherit' onClick={() => setDev(false)}>
                <DeveloperBoard />
              </IconButton>
            )}

            <LocaleSelector />
            {session && session.user ? (
              <>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleMenu}
                  color='inherit'
                >
                  {session.user.image ? <Avatar src={session.user.image} sx={{ width: 30, height: 30 }} /> : <AccountCircle />}
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    {session.user.image ? (
                      <ListItemIcon>
                        <Avatar src={session.user.image} sx={{ mr: 2, width: 80, height: 80 }} />
                      </ListItemIcon>
                    ) : (
                      <ListItemIcon>
                        <AccountCircle sx={{ fontSize: 80, mr: 2 }} />
                      </ListItemIcon>
                    )}
                    <Stack direction='column'>
                      <Stack direction='row'>
                        <Typography variant='h6'>{displayName}</Typography>

                        <IconButton
                          size='small'
                          onClick={() => {
                            setDisplayName('')
                          }}
                          sx={{ color: theme.palette.text.disabled, fontSize: 12, ml: 1 }}
                        >
                          <Edit sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Stack>
                      <Typography variant='caption' color={'InactiveCaptionText'}>
                        {session.user.name}
                      </Typography>
                      {(me.role?.type === 'privileged' || me.role?.type === 'administrator') && (
                        <Typography
                          color={'InactiveCaptionText'}
                          sx={{
                            // color: 'primary.main',
                            fontSize: '0.75rem',
                            letterSpacing: '0.1em'
                          }}
                        >
                          {/** capitalize: */}
                          {me.role?.type.toLocaleUpperCase()}
                        </Typography>
                      )}
                    </Stack>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => setDisplayName('')}>
                    <ListItemIcon>
                      <Visibility />
                    </ListItemIcon>
                    <ListItemText>{t('Clear DisplayName')}</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => enqueueSnackbar('Testing snackbar notifications', { variant: 'info' })}>
                    <ListItemIcon>
                      <MessageRounded />
                    </ListItemIcon>
                    <ListItemText>{t('Test Snackbar')}</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => setDarkMode(!darkMode)}>
                    <ListItemIcon>{theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}</ListItemIcon>
                    <ListItemText>{t('Toggle DarkMode')}</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      setMeetings([])
                      setOtherMeetings([])
                      setMe({} as IMe)
                      signOut()
                    }}
                  >
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <IconButton onClick={() => setDarkMode(!darkMode)} color='inherit'>
                  {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                <IconButton color='inherit' onClick={() => enqueueSnackbar('Testing snackbar notifications', { variant: 'info' })}>
                  <MessageRounded />
                </IconButton>
                <IconButton color='inherit' onClick={() => signIn()}>
                  <Login />
                </IconButton>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default TopBarBase
