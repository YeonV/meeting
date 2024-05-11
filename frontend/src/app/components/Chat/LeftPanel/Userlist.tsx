import useStore from '@/store/useStore'
import { ArrowBack, FilterList, MoreVert, Search } from '@mui/icons-material'
import { AppBar, Avatar, Box, IconButton, Stack, TextField, Toolbar, Typography, useTheme } from '@mui/material'
import User from './User'
import useTranslation from '@/lib/utils'
import { useSession } from 'next-auth/react'
import zIndex from '@mui/material/styles/zIndex'
import { useState } from 'react'
import UserProfile from './UserProfile'

const Userlist = ({ me }: { me: string }) => {
  const theme = useTheme()
  const language = useStore((state) => state.language)
  const chats = useStore((state) => state.chats)
  const { t } = useTranslation(language)
  const { data: session } = useSession()
  const [userProfileOpen, setUserProfileOpen] = useState(false)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 500,
        width: 450,
        border: '1px solid gray',
        borderRight: '1px solid #5555',
        p: 0,
        paddingTop: '64px',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      <AppBar position='absolute' elevation={2} sx={{ zIndex: 10 }}>
        <Toolbar>
          <Stack direction='row' alignItems='center' justifyContent='space-between' flex={1}>
            {userProfileOpen ? (
              <>
                <IconButton color='inherit' sx={{ mr: 2, ml: 0, p: 0 }} onClick={() => setUserProfileOpen(!userProfileOpen)}>
                  <ArrowBack />
                </IconButton>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                  {t('Profile')}
                </Typography>
              </>
            ) : (
              <IconButton color='inherit' sx={{ mr: 2, ml: 0, p: 0 }} onClick={() => setUserProfileOpen(!userProfileOpen)}>
                {session?.user.image ? (
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.primary.contrastText }} src={session?.user.image} />
                ) : (
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.primary.contrastText }}>{me?.charAt(0)}</Avatar>
                )}
              </IconButton>
            )}
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between'>
              <IconButton color='inherit'>
                <MoreVert />
              </IconButton>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      <Stack direction='row' alignItems='center' justifyContent='center' padding={'0.75rem 1rem'}>
        <TextField
          placeholder={t('Search')}
          autoFocus
          // value={inputValue}
          // onChange={(e) => setInputValue(e.target.value)}
          sx={{
            'flexGrow': 1,
            'backgroundColor': theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
            'color': theme.palette.text.disabled,
            'mr': 1,
            'borderRadius': '12px',
            'display': 'flex',
            'justfyContent': 'center',
            '& fieldset': { border: 'none', borderRadius: '12px' }
          }}
          InputProps={{ startAdornment: <Search sx={{ mr: 2 }} /> }}
          inputProps={{ style: { height: 12 } }}
        />
        <IconButton
          // disabled={inputValue === ''}
          //  onClick={sendMessage}
          color='inherit'
        >
          <FilterList />
        </IconButton>
      </Stack>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {chats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1]
          return (
            <User
              key={chat.id}
              name={chat.members?.join(', ') || 'General'}
              id={chat.id}
              lastMessage={
                lastMessage?.time
                  ? lastMessage
                  : {
                      author: lastMessage?.author || 'Blade',
                      content: lastMessage?.content || 'No messages yet',
                      time: Date.now()
                    }
              }
              group={chat.group}
            />
          )
        })}
      </Box>
      <UserProfile open={userProfileOpen} />
    </Box>
  )
}

export default Userlist
