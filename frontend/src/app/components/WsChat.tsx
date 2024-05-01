// 'use client'

// import { useCallback, useEffect, useRef, useState } from 'react'
// import { useSession } from 'next-auth/react'
// import { useWebSocket } from 'next-ws/client'
// import useStore from '@/store/useStore'
// import { Box, List, ListItem, Typography, Fab, Popover, useTheme, Stack, Toolbar, AppBar, Avatar, Badge } from '@mui/material'
// import moment from 'moment'
// import { Chat } from '@mui/icons-material'
// import MessageBar from './Chat/MessageBar'
// import HeaderBar from './Chat/HeaderBar'
// import History from './Chat/History'

// const WsChat = () => {
//   const { data: session } = useSession()
//   const fetchOtherMeetings = useStore((state) => state.fetchOtherMeetings)
//   const fetchAllMeetings = useStore((state) => state.fetchAllMeetings)
//   const me = useStore((state) => state.me)
//   const theme = useTheme()
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const [messages, setMessages] = useState<{ message: string; timestamp: number }[]>([])
//   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
//   const [readMessages, setReadMessages] = useState<{ message: string; timestamp: number }[]>([])

//   const open = Boolean(anchorEl)
//   const id = open ? 'simple-popover' : undefined

//   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleClose = () => {
//     setAnchorEl(null)
//   }
//   const ws = useWebSocket()

//   const onMessage = useCallback((event: MessageEvent<string>) => {
//     console.log('received message', event.data)
//     setMessages((prevMessages) => {
//       const lastMessage = prevMessages[prevMessages.length - 1]
//       if (!lastMessage || lastMessage.message !== event.data) {
//         return [...prevMessages, { message: event.data, timestamp: Date.now() }]
//       }
//       return prevMessages
//     })
//     if (session && session.strapiToken) {
//       console.log('fetching meetings')
//       me.role?.type === 'employee' ? fetchAllMeetings(session.strapiToken) : fetchOtherMeetings(session.strapiToken)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   useEffect(() => {
//     ws?.addEventListener('message', onMessage)
//     return () => ws?.removeEventListener('message', onMessage)
//   }, [onMessage, ws])

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//     if (open) {
//       setReadMessages(messages)
//     }
//   }, [messages, open])

//   useEffect(() => {
//     if (open) {
//       setReadMessages(messages)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open])

//   return (
//     <>
//       <Fab onClick={handleClick} color='primary' aria-label='chat' sx={{ position: 'fixed', bottom: 16, right: 16 }}>
//         <Badge badgeContent={messages.length - readMessages.length} color='error' max={99}>
//           <Chat />
//         </Badge>
//       </Fab>
//       <Popover
//         id={id}
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'right'
//         }}
//         transformOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right'
//         }}
//       >
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             height: 800,
//             width: 480,
//             border: '1px solid gray',
//             borderRadius: 2,
//             p: 0,
//             paddingTop: '64px',
//             position: 'relative'
//           }}
//         >
//           <HeaderBar messages={messages} rounded />
//           <History setReadMessages={setReadMessages} />
//           <MessageBar rounded />
//         </Box>
//       </Popover>
//     </>
//   )
// }

// export default WsChat
