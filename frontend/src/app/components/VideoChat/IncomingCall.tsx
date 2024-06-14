import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, Slider, Stack, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import Peer from 'peerjs'
import { Call, CallEnd, CallMade, CallReceived, Flip, Fullscreen, FullscreenExit, Mic, RingVolume, VolumeMute, VolumeOff, VolumeUp } from '@mui/icons-material'
import VideoFrame from './VideoFrame'
import { useWebSocket } from 'next-ws/client'



const IncomingCall: React.FC = () => {
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [fullScreen, setFullScreen] = useState(false)
  const [flip, setFlip] = useState(false)
  const [ownVolume, setOwnVolume] = useState<number | number[]>(1)
  const [otherVideoVolume, setOtherVideoVolume] = useState<number | number[]>(1)
  const ringing = useStore((state) => state.ringing)
  const setRinging = useStore((state) => state.setRinging)
  const incomingCall = useStore((state) => state.dialogs.incomingCall)
  const setOpen = useStore((state) => state.setDialogs)
  const otherCallId = useStore((state) => state.otherCallId)
  const otherAuthorName = useStore((state) => state.otherAuthorName)
  const otherAuthorAvatar = useStore((state) => state.otherAuthorAvatar)
  const imTheCaller = useStore((state) => state.imTheCaller);
  const displayName = useStore((state) => state.displayName);
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const callingVideoRef = useRef<HTMLVideoElement>(null)
  const myCallId = useStore((state) => state.myCallId)
  const ws = useWebSocket()
  const handleClose = () => {
    setOpen('incomingCall', false)
    setRinging(false)

  }
  // Function to handle volume change for your own audio
  const handleOwnVolumeChange = (v: number | number[]) => {
    // Set the volume for your own audio (e.g., callingVideoRef.current.volume = newVolume)
    if (typeof v === 'number') {
      myVideoRef.current!.volume = v
    }
  };

  // Function to handle volume change for the other user's video
  const handleOtherVideoVolumeChange = (v: number | number[]) => {
    // Set the volume for the other user's video (e.g., callingVideoRef.current.volume = newVolume)
    if (typeof v === 'number') {
      callingVideoRef.current!.volume = v
    }
  };

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

      if (typeof window !== 'undefined' && incomingCall) {
        peer = new Peer(myCallId, {
          host: (process.env.NEXT_PUBLIC_PEERJS_URL_DOCKER || 'localhost').split(':')[1].replace('//', ''),
          port: parseInt((process.env.NEXT_PUBLIC_PEERJS_URL_DOCKER || 'y:z:9000').split(':')[2]),
          path: '/'
        })


        setPeerInstance(peer)

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream
              ; (window as any).streamA = stream
          }

          peer.on('call', (call) => {
            call.answer(stream)
            call.on('stream', (userVideoStream) => {
              if (callingVideoRef.current) {
                callingVideoRef.current.srcObject = userVideoStream
                  ; (window as any).streamB = userVideoStream
              }
            })
          })
        })
      } else {
        ; ((window as any).streamA as MediaStream)?.getTracks().forEach((track) => {
          track.stop()
        })

      }
      return () => {
        if (peer) {
          peer.destroy();
        }

        ; ((window as any).streamA as MediaStream)?.getTracks().forEach((track) => {
          track.stop()
        })



      };

    }
  }, [incomingCall, myCallId, setPeerInstance])

  const isMobile = useMediaQuery('(max-width: 600px)')

  return (
    <Dialog PaperProps={{
      sx: {
        maxWidth: 'unset'
      }
    }} fullScreen={fullScreen} open={incomingCall && otherCallId !== ''} onClose={handleClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <motion.div animate={{ scale: ringing ? [1.3, 1] : 1 }} transition={{ duration: 0.5, repeat: ringing ? Infinity : 1 }}>
          <Avatar src={otherAuthorAvatar} sx={{ mr: 2 }}>
            {otherAuthorAvatar ? null : otherAuthorName.charAt(0)}
          </Avatar>
        </motion.div>
        <Typography sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
          {imTheCaller
            ? `calling ${otherAuthorName}`
            : `${otherAuthorName} is calling`}
        </Typography>
      </DialogTitle>
      <IconButton onClick={() => setRinging(!ringing)} sx={{ position: 'absolute', top: '1rem', right: '5rem' }}>
        {ringing ? <VolumeOff /> : <RingVolume />}
      </IconButton>
      <IconButton onClick={() => setFlip(!flip)} sx={{ position: 'absolute', top: '1rem', right: '3rem' }}>
        <Flip />
      </IconButton>
      <IconButton onClick={() => setFullScreen(!fullScreen)} sx={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        {fullScreen ? <FullscreenExit /> : <Fullscreen />}
      </IconButton>
      <DialogContent>
        <Paper
          sx={{
            overflow: 'hidden',
            padding: 0,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <Grid container spacing={0} minWidth={640} minHeight={250}>
            <Grid item xs={12} md={6}>
              <VideoFrame callingVideoRef={myVideoRef} name={displayName} muted />
            </Grid>
            <Grid item xs={12} md={6} >
              <VideoFrame callingVideoRef={callingVideoRef} name={otherAuthorName} />
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Stack direction='column' spacing={2} width={'100%'} pl={2} pr={2}>
          <Stack direction='row' spacing={5} alignItems={'center'}>
          <Stack direction='row' spacing={0} alignItems={'center'}flexGrow={1}>    
              <IconButton>
                <Mic />
              </IconButton>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={ownVolume || 1}
                onChange={(_e, v) => {
                  handleOwnVolumeChange(v)
                  setOwnVolume(v)
                }}
              />
            
            </Stack>

          <Stack direction='row' spacing={0} alignItems={'center'}flexGrow={1} pr={2}>
              <IconButton>
                <VolumeUp />
              </IconButton>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={otherVideoVolume || 1} 
                onChange={(_e, v) => {
                  handleOtherVideoVolumeChange(v)
                  setOtherVideoVolume(v)
                }}
              />
          </Stack>
          </Stack>

          <Stack direction='row' spacing={2} alignItems={'center'} justifyContent={'flex-end'} flexGrow={1}>
          <Button
            startIcon={<CallEnd />}
            variant='contained'
            color='error'
            onClick={() => {
              setRinging(false)
              setOpen('incomingCall', false)
              const msg = JSON.stringify({
                type: 'videocall-rejected',
                callerId: myCallId,
              })
              ws?.send(msg)
            }}
          >
            {imTheCaller ? 'Hang up' : 'Reject'}
          </Button>
          {!imTheCaller && <Button
            startIcon={<Call />}
            color='primary'
            variant='contained'
            onClick={() => {
              setRinging(false)
              navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                  const call = peerInstance?.call(otherCallId, stream);
                  if (call) {
                    call.on("stream", (userVideoStream) => {
                      if (callingVideoRef.current) {
                        callingVideoRef.current.srcObject = userVideoStream;
                      }
                    });
                  }
                });
            }}
          >
            Accept
          </Button>}
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default IncomingCall
