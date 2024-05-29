'use client'

import { useSession } from 'next-auth/react'
import Box from '../Motion/Box'
import { Avatar, ListItemIcon, Stack, Typography } from '@mui/material'
import { AccountCircle, AdminPanelSettings, CalendarToday, ChatOutlined, Mail, Person, QuestionAnswer, Visibility } from '@mui/icons-material'
import useStore from '@/store/useStore'
import { Row } from '../Chat/LeftPanel/UserProfile'
import useTranslation from '@/lib/utils'
import Image from 'next/image'
import WsLogo from '../Welcome/Logos/WsLogo'
import StrapiLogo from '../Welcome/Logos/StrapiLogo'

const Admin = () => {
  const { data: session } = useSession()
  const displayName = useStore((state) => state.displayName)
  const me = useStore((state) => state.me)
  const chats = useStore((state) => state.chats)
  const messages = chats.flatMap((c) => c.messages)
  const meetings = useStore((state) => state.meetings)
  const darkMode = useStore((state) => state.darkMode)

  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)
  return (
    <Box flex={1} display='flex' justifyContent='center' alignItems='center' flexDirection={'column'}>
      {session && session.strapiToken ? (
        <>
          {session.user.image ? (
            <ListItemIcon>
              <Avatar src={session.user.image} sx={{ mr: 2, width: 300, height: 300, border: `12px solid ${darkMode ? '#222' : '#ddd'}` }} />
            </ListItemIcon>
          ) : (
            <ListItemIcon>
              <AccountCircle sx={{ fontSize: 300, mr: 2 }} />
            </ListItemIcon>
          )}

          <Box sx={{ mt: 8, padding: 4, color: '#999' }}>
            {session?.user.name && session?.user.email && (
              <>
                <Stack direction={'row'} spacing={5} alignItems={'center'} mb={2}>
                  <Box>
                    <Row icon={<Image src='/nextjsLogo.svg' alt='nextjs' width={40} height={40} />} name={'Display Name'} />
                    <Row
                      icon={
                        <Image style={{ transform: 'scale(0.75)', filter: 'grayscale(1)' }} src='/Logos/nextauth.png' alt='nextjs' width={40} height={40} />
                      }
                      name={'Name via NextAuth'}
                    />
                    <Row
                      icon={
                        <Image style={{ transform: 'scale(0.75)', filter: 'grayscale(1)' }} src='/Logos/nextauth.png' alt='nextjs' width={40} height={40} />
                      }
                      name={'Email via NextAuth'}
                    />
                    <Row icon={<WsLogo size={40} />} name={'Chats via NextWs'} />
                    <Row icon={<WsLogo size={40} />} name={'Messages via NextWs'} />
                    <Row icon={<StrapiLogo logoOnly size={40} />} name={'Meetings via Strapi'} />
                    <Row icon={<StrapiLogo logoOnly size={40} />} name={'Role via Strapi'} />
                  </Box>
                  <Box>
                    <Row icon={<Visibility color='inherit' sx={{ fontSize: 40 }} />} name={displayName} />
                    <Row icon={<Person color='inherit' sx={{ fontSize: 40 }} />} name={session?.user.name} />
                    <Row icon={<Mail color='inherit' sx={{ fontSize: 40 }} />} name={session?.user.email} />
                    <Row
                      icon={<QuestionAnswer color='inherit' sx={{ fontSize: 40 }} />}
                      name={chats.length.toString() + ' ' + (chats.length === 1 ? t('Chat') : t('Chats'))}
                    />
                    <Row
                      icon={<ChatOutlined color='inherit' sx={{ fontSize: 40 }} />}
                      name={(messages.length - 1).toString() + ' ' + (messages.length === 2 ? t('Message') : t('Messages'))}
                    />
                    <Row
                      icon={<CalendarToday color='inherit' sx={{ fontSize: 40 }} />}
                      name={meetings.length.toString() + ' ' + (meetings.length === 1 ? t('Meeting') : t('Meetings'))}
                    />
                    <Row icon={<AdminPanelSettings color='inherit' sx={{ fontSize: 40 }} />} name={me.role?.type} />
                  </Box>
                </Stack>
              </>
            )}
          </Box>
        </>
      ) : null}
    </Box>
  )
}

export default Admin
