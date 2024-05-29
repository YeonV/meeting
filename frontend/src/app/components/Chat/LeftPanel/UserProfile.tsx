import useTranslation from '@/lib/utils'
import useStore from '@/store/useStore'
import { Chat, ChatBubble, ChatOutlined, Mail, Person, QuestionAnswer, Visibility } from '@mui/icons-material'
import { Avatar, Box, Divider, Icon, Paper, Stack, Typography, useTheme } from '@mui/material'
import { useSession } from 'next-auth/react'

export const Row = ({ icon = <Person />, name = 'Yeon', caption = '' }) => {
  return (
    <Stack direction={'row'} spacing={2} alignItems={'center'} mb={2}>
      {caption && (
        <Typography textAlign={'right'} sx={{ fontSize: 20, fontWeight: 200, minWidth: 200 }}>
          {caption}
        </Typography>
      )}
      {icon}
      <Typography sx={{ fontSize: 20, fontWeight: 200 }}>{name}</Typography>
    </Stack>
  )
}
const UserProfile = ({ open }: { open: boolean }) => {
  const theme = useTheme()
  const { data: session } = useSession()
  const displayName = useStore((state) => state.displayName)
  const chats = useStore((state) => state.chats)
  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)
  const messages = chats.flatMap((c) => c.messages)
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'absolute',
        bottom: 0,
        top: 66,
        width: '100%',
        zIndex: 20,
        left: open ? 0 : '-100%',
        transition: 'left 0.15s ease-in',
        borderRadius: 0
      }}
    >
      <Paper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, borderRadius: 0 }} elevation={2}>
        {session?.user.image ? (
          <Avatar
            sx={{
              border: '10px solid',
              borderColor: theme.palette.background.paper,
              marginTop: 16,
              width: '220px',
              height: '220px',
              bgcolor: theme.palette.secondary.main,
              color: theme.palette.primary.contrastText
            }}
            src={session?.user.image}
          />
        ) : (
          <Avatar
            sx={{
              border: '10px solid',
              borderColor: theme.palette.background.paper,
              marginTop: 16,
              width: '220px',
              height: '220px',
              bgcolor: theme.palette.secondary.main,
              color: theme.palette.primary.contrastText
            }}
          >
            {displayName?.charAt(0)}
          </Avatar>
        )}
      </Paper>
      <Box sx={{ mt: 8, padding: 4, color: '#999' }}>
        <Box sx={{ mb: 5, fontSize: 32, fontWeight: 400, display: 'flex', justifyContent: 'center' }}>{displayName}</Box>
        {session?.user.name && session?.user.email && (
          <>
            <Row icon={<Visibility color='inherit' sx={{ fontSize: 40 }} />} name={displayName} />
            <Row icon={<Person color='inherit' sx={{ fontSize: 40 }} />} name={session?.user.name} />
            <Row icon={<Mail color='inherit' sx={{ fontSize: 40 }} />} name={session?.user.email} />
            <Row
              icon={<QuestionAnswer color='inherit' sx={{ fontSize: 40 }} />}
              name={chats.length.toString() + ' ' + (chats.length > 1 ? t('Chats') : t('Chat'))}
            />
            <Row
              icon={<ChatOutlined color='inherit' sx={{ fontSize: 40 }} />}
              name={messages.length.toString() + ' ' + (messages.length > 1 ? t('Messages') : t('Message'))}
            />
          </>
        )}
      </Box>
    </Paper>
  )
}

export default UserProfile
