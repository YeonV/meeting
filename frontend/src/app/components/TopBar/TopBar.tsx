'use client'

import { useState, MouseEvent } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Avatar, Chip, Divider, ListItemIcon, ListItemText, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material'
import { Brightness4, Brightness7, CalendarToday, Chat, DeveloperBoard, List, Login, Logout } from '@mui/icons-material'
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

const TopBarBase = () => {
  const { data: session } = useSession()
  const theme = useTheme()

  const darkMode = useStore((state) => state.darkMode)
  const setDarkMode = useStore((state) => state.setDarkMode)
  const dev = useStore((state) => state.dev)
  const me = useStore((state) => state.me)
  const setDev = useStore((state) => state.setDev)
  const currentTab = useStore((state) => state.currentTab)
  const setCurrentTab = useStore((state) => state.setCurrentTab)
  const setMeetings = useStore((state) => state.setMeetings)
  const setOtherMeetings = useStore((state) => state.setOtherMeetings)
  const setMe = useStore((state) => state.setMe)

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
            <Image src={darkMode ? '/icon.png' : '/icon-with-bg.png'} alt='logo' width={40} height={40} style={{ marginRight: '1rem' }} />
            {session && session.user ? (
              <Tabs
                value={currentTab}
                onChange={(event: React.SyntheticEvent, newValue: number) => {
                  setCurrentTab(newValue)
                }}
              >
                <Tab iconPosition='start' icon={<CalendarToday />} value={1} label='Calendar' />
                <Tab iconPosition='start' icon={<List />} value={2} label='Meetings' />
                <Tab iconPosition='start' icon={<Chat />} value={3} label='Chat' />
              </Tabs>
            ) : (
              <>
                <Typography variant='h6'>Meetings</Typography>
              </>
            )}
          </Stack>
          {me.role?.type === 'employee' && <Chip label='Admin' color='primary' variant='outlined' sx={{ mr: 2 }} />}

          <Stack direction='row' spacing={2} alignItems={'center'}>
            {dev && (
              <IconButton color='inherit' onClick={() => setDev(false)}>
                <DeveloperBoard />
              </IconButton>
            )}
            <IconButton onClick={() => setDarkMode(!darkMode)} color='inherit'>
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
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
                  <AccountCircle />
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
                    {session.user.image && (
                      <ListItemIcon>
                        <Avatar src={session.user.image} sx={{ mr: 2, width: 30, height: 30 }} />
                      </ListItemIcon>
                    )}
                    {session.user.name}
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose}>Test</MenuItem>
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
              <IconButton color='inherit' onClick={() => signIn()}>
                <Login />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default TopBarBase
