import useStore from '@/store/useStore'
import { FilterList, MoreVert, Search } from '@mui/icons-material'
import { AppBar, Avatar, Box, IconButton, Stack, TextField, Toolbar, useTheme } from '@mui/material'
import User from './User'

const Userlist = ({ me }: { me: string }) => {
  const theme = useTheme()

  const chats = useStore((state) => state.chats)

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
        position: 'relative'
      }}
    >
      <AppBar position='absolute' elevation={2}>
        <Toolbar>
          <Stack direction='row' alignItems='center' justifyContent='space-between' flex={1}>
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.primary.contrastText, mr: 2 }}>{me?.charAt(0)}</Avatar>
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
          placeholder='Suchen'
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
        {/* {chats.map((chat) => {
          const timeFromNow = moment(chat.time).fromNow()
          const formattedDate = moment(chat.time).format('DD.MM.YYYY, hh:mm')
          const displayTime = moment().diff(moment(chat.time), 'days') <= 2 ? timeFromNow : formattedDate
          return (
            <Box
              key={chat.id}
              sx={{
                'display': 'flex',
                'flexDirection': 'row',
                'alignItems': 'center',
                'p': 2,
                'cursor': 'pointer',
                'borderBottom': '1px solid #5555',
                'backgroundColor': activeChat === chat.id ? '#5555' : 'transparent',
                '&:hover': {
                  backgroundColor: '#5553'
                }
              }}
            >
              <Avatar sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.primary.contrastText, mr: 2 }}>{chat.name.charAt(0)}</Avatar>
              <Stack direction='column' spacing={0} alignItems='flex-start' flex={1}>
                <Box>{chat.name}</Box>
                <Typography color={theme.palette.text.disabled}>{chat.message}</Typography>
              </Stack>
              <Typography color={theme.palette.text.disabled}>{displayTime}</Typography>
            </Box>
          )
        })} */}
      </Box>
    </Box>
  )
}

export default Userlist
