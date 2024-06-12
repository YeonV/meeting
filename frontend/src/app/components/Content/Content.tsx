'use client'

import { Box } from '@mui/material'
import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useWebSocket } from 'next-ws/client'
import useStore from '@/store/useStore'
import Calendar from '../Calendar/Calendar'
import Meetings from '../Meetings/Meetings'
import Chat from '../Chat/Chat'
import WsProvider from '../../Providers/WsProvider'
import Welcome from '../Welcome/Welcome'
import Admin from '../Admin/Admin'
import VideoChat from '../VideoChat/VideoChat'

const Content = () => {
  const { data: session } = useSession()
  const ws = useWebSocket()

  const meetings = useStore((state) => state.meetings)
  const currentTab = useStore((state) => state.currentTab)

  const notify = useCallback(() => ws?.send('StateChange'), [ws])

  return (
    <>
      {session ? (
        <WsProvider>
          <Box flex={1} display='flex' flexDirection='column' width={'100%'}>
            {currentTab === 0 && (
              <div style={{ paddingTop: '2rem' }}>
                <Welcome notify={notify} />
              </div>
            )}
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
            {currentTab === 4 && (
              <div style={{ paddingTop: '2rem', display: 'flex', flexGrow: 1 }}>
                <Admin />
              </div>
            )}
            {currentTab === 5 && (
              <div style={{ paddingTop: '2rem', display: 'flex', flexGrow: 1 }}>
                <VideoChat />
              </div>
            )}
          </Box>
        </WsProvider>
      ) : (
        <Box flex={1} display='flex' flexDirection='column' width={'100%'}>
          <div style={{ paddingTop: '2rem' }}>
            <Welcome notify={notify} />
          </div>
        </Box>
      )}
    </>
  )
}

export default Content
