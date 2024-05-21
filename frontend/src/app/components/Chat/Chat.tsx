'use client'

import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import useStore from '@/store/useStore'
import MessageBar from './RightPanel/MessageBar'
import History from './RightPanel/History/History'
import Userlist from './LeftPanel/Userlist'
import HeaderBar from './RightPanel/HeaderBar'

const Chat = () => {
  const [emojiOpen, setEmojiOpen] = useState(false)
  const chats = useStore((state) => state.chats)
  const activeChat = useStore((state) => state.activeChat)
  const chat = chats.find((c) => c.id === activeChat)

  return (
    <>
      <Stack direction={'row'} spacing={0} m={3} flex={1}>
        <Userlist me='YZ' />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minHeight: 500,
            border: '1px solid gray',
            borderLeft: 0,
            p: 0,
            paddingTop: '64px',
            position: 'relative'
          }}
        >
            <HeaderBar />
            <History emojiOpen={emojiOpen} messages={chat?.messages || []} group={chat?.group} />
            <MessageBar emojiOpen={emojiOpen} setEmojiOpen={setEmojiOpen} />
        </Box>
      </Stack>
    </>
  )
}

export default Chat
