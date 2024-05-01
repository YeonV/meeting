import useStore from '@/store/useStore'
import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material'
import moment from 'moment'
import { useSession } from 'next-auth/react'

const User = ({
  name,
  id,
  lastMessage: { author, content, time },
  group
}: {
  name: string
  id?: string
  lastMessage: {
    author: string
    content: string
    time?: number
  }
  group?: boolean
}) => {
  const { data: session } = useSession()

  const theme = useTheme()
  const activeChat = useStore((state) => state.activeChat)
  const chats = useStore((state) => state.chats)
  const chat = chats.find((c) => c.id === id)
  const otherUser = chat?.members?.find((m) => m !== session?.user?.email && m !== session?.user?.name?.replace('#', '-'))
  const setActiveChat = useStore((state) => state.setActiveChat)
  const timeFromNow = moment(time).fromNow()
  const formattedDate = moment(time).format('DD.MM.YYYY, hh:mm')
  const displayTime = moment().diff(moment(time), 'days') <= 2 ? timeFromNow : formattedDate
  return (
    <Box
      key={name}
      onClick={() => setActiveChat(id ? id : '0')}
      sx={{
        'display': 'flex',
        'flexDirection': 'row',
        'alignItems': 'center',
        'p': 2,
        'cursor': 'pointer',
        'borderBottom': '1px solid #5555',
        'backgroundColor': activeChat === id ? '#5555' : 'transparent',
        '&:hover': {
          backgroundColor: '#5553'
        }
      }}
    >
      <Avatar sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.primary.contrastText, mr: 2 }}>{otherUser?.charAt(0)}</Avatar>
      <Stack direction='column' spacing={0} alignItems='flex-start' flex={1}>
        <Box>{group ? name : otherUser}</Box>
        <Typography color={theme.palette.text.disabled}>{content}</Typography>
      </Stack>
      <Stack direction='column' spacing={0.5} alignItems='flex-end' flex={1}>
        {group && (
          <Typography
            variant='caption'
            textTransform={'uppercase'}
            color={theme.palette.text.disabled}
            sx={{ border: '1px solid', padding: '0 8px', borderRadius: 1 }}
          >
            group
          </Typography>
        )}
        <Typography color={theme.palette.text.disabled}>{displayTime}</Typography>
      </Stack>
    </Box>
  )
}

export default User
