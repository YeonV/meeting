'use client'

import { Box, Typography, Button } from '@mui/material'
import { useCallback } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useWebSocket } from 'next-ws/client'
import useStore from '@/store/useStore'
import Calendar from './Calendar/Calendar'
import Meetings from './Meetings/Meetings'
import Chat from './Chat'

const Content = () => {
  const { data: session } = useSession()
  const ws = useWebSocket()

  const meetings = useStore((state) => state.meetings)
  const currentTab = useStore((state) => state.currentTab)
  const darkMode = useStore((state) => state.darkMode)

  const notify = useCallback(() => ws?.send('StateChange'), [ws])

  return (
    <>
      {meetings && session ? (
        <Box flex={1} display='flex' flexDirection='column' width={'100%'}>
          {currentTab === 1 && (
            <div style={{ paddingTop: '2rem' }}>
              <Calendar meetings={meetings} notify={notify} />
            </div>
          )}
          {currentTab === 2 && (
            <div style={{ paddingTop: '2rem' }}>
              <Meetings meetings={meetings} notify={notify} />
            </div>
          )}
          {currentTab === 3 && (
            <div style={{ paddingTop: '2rem', display: 'flex', flexGrow: 1 }}>
              <Chat />
            </div>
          )}
        </Box>
      ) : (
        <Box flex={1} display='flex' justifyContent='center' alignItems='center' flexDirection={'column'}>
          <Typography variant='h1'>Welcome to YZ-Meetings</Typography>
          <Typography variant='h4' color={'GrayText'}>
            To get started, please sign in
          </Typography>
          <Button variant='contained' size='large' color={darkMode ? 'inherit' : 'primary'} onClick={() => signIn()} sx={{ m: 8 }}>
            Sign in
          </Button>
          <button onClick={() => notify()}>notify test</button>
        </Box>
      )}
    </>
  )
}

export default Content
