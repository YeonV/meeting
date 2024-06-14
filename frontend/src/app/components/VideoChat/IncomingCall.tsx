import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import Peer from 'peerjs'
import { Fullscreen, FullscreenExit } from '@mui/icons-material'

interface IncomingCallProps {
  callerId: string
  onAccept: () => void
  onReject: () => void
  setPeerInstance: React.Dispatch<React.SetStateAction<Peer | null>>
  peerInstance: Peer | null
}

const IncomingCall: React.FC<IncomingCallProps> = ({ onAccept, onReject, peerInstance, setPeerInstance }) => {
  const [fullScreen, setFullScreen] = useState(false)
  const ringing = useStore((state) => state.ringing)
  const setRinging = useStore((state) => state.setRinging)
  const incomingCall = useStore((state) => state.dialogs.incomingCall)
  const setOpen = useStore((state) => state.setDialogs)
  const otherCallId = useStore((state) => state.otherCallId)
  const otherAuthorName = useStore((state) => state.otherAuthorName)
  const otherAuthorAvatar = useStore((state) => state.otherAuthorAvatar)
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const callingVideoRef = useRef<HTMLVideoElement>(null)
  const myCallId = useStore((state) => state.myCallId)
  const handleClose = () => {
    setOpen('incomingCall', false)
  }

  useEffect(() => {
    const audio = new Audio('/call.mp3')
    let intervalId: any

    if (incomingCall && ringing) {
      audio.play().catch(() => console.warn('Ringtone failed to play'))
      intervalId = setInterval(() => audio.play().catch(() => console.warn('Ringtone failed to play')), 3000)
    }

    return () => {
      clearInterval(intervalId)
      audio.pause()
    }
  }, [incomingCall, ringing])

  useEffect(() => {
    if (myCallId) {
      let peer: Peer
      if (typeof window !== 'undefined') {
        peer = new Peer(myCallId, {
          host: (process.env.NEXT_PUBLIC_PEERJS_URL_DOCKER || 'localhost').split(':')[1].replace('//', ''),
          port: parseInt((process.env.NEXT_PUBLIC_PEERJS_URL_DOCKER|| 'y:9000').split(':')[2]),
          path: '/myapp'
        })

        if (incomingCall) {
          setPeerInstance(peer)

          navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            if (myVideoRef.current) {
              myVideoRef.current.srcObject = stream
            }

            peer.on('call', (call) => {
              call.answer(stream)
              call.on('stream', (userVideoStream) => {
                if (callingVideoRef.current) {
                  callingVideoRef.current.srcObject = userVideoStream
                }
              })
            })
          })
        }
      } else {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          stream.getTracks().forEach((track) => {
            track.stop()
          })
        })
      }

      return () => {
        if (peer) {
          peer.destroy()
          // close user media audio and video
          navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            stream.getTracks().forEach((track) => {
              track.stop()
            })
          })
        }
      }
    }
  }, [incomingCall, myCallId, setPeerInstance])

  const isMobile = useMediaQuery('(max-width: 600px)')

  return (
    <Dialog fullScreen={fullScreen} open={incomingCall && otherCallId !== ''} onClose={handleClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <motion.div animate={{ scale: ringing ? [1.3, 1] : 1 }} transition={{ duration: 0.5, repeat: ringing ? Infinity : 1 }}>
          <Avatar src={otherAuthorAvatar} sx={{ mr: 2 }}>
            {otherAuthorAvatar ? null : otherAuthorName.charAt(0)}
          </Avatar>
        </motion.div>
        <Typography sx={{ fontWeight: 500, fontSize: '1.2rem' }}>{otherAuthorName} is calling</Typography>
      </DialogTitle>
      <IconButton onClick={() => setFullScreen(!fullScreen)} sx={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        {fullScreen ? <FullscreenExit /> : <Fullscreen />}
      </IconButton>
      <DialogContent>
        <Paper
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <video playsInline ref={myVideoRef} autoPlay style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <video playsInline ref={callingVideoRef} autoPlay style={{ width: '100%' }} />
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color='error'
          onClick={() => {
            onReject()
            setRinging(false)
          }}
        >
          Reject
        </Button>
        <Button
          color='primary'
          variant='contained'
          onClick={() => {
            setRinging(false)
            onAccept()
          }}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default IncomingCall
