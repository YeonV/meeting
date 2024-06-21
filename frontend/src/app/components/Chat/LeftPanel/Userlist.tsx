import { ArrowBack, FilterList, MoreVert, Search } from '@mui/icons-material'
import { AppBar, Avatar, Box, IconButton, Stack, TextField, Toolbar, Typography, useTheme } from '@mui/material'
import { useSession } from 'next-auth/react'
import User from './User'
import useStore from '@/store/useStore'
import useTranslation from '@/lib/utils'
import UserProfile from './UserProfile'

export const UserHeader = () => {
  const theme = useTheme()
  const { data: session } = useSession()
  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)
  const userProfileOpen = useStore((state) => state.userProfileOpen)
  const setUserProfileOpen = useStore((state) => state.setUserProfileOpen)
  return (
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
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.primary.contrastText }}>{session?.user?.name?.charAt(0)}</Avatar>
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
  )}
const Userlist = ({onUserClick}:{
  onUserClick: (id: string) => void
}) => {
  const theme = useTheme()
  const language = useStore((state) => state.language)
  const chats = useStore((state) => state.chats)
  const { t } = useTranslation(language)
  const userProfileOpen = useStore((state) => state.userProfileOpen)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 500,
        width: '100%',
        borderRight: '1px solid #5555',
        p: 0,
        paddingTop: '8px',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      <Stack direction='row' alignItems='center' justifyContent='center' padding={'0rem 0.7rem'}>
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
              onUserClick={onUserClick}
            />
          )
        })}
      </Box>
      <UserProfile open={userProfileOpen} />
    </Box>
  )
}

export default Userlist
