import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material'
import VideoFrame from './VideoFrame'
import useStore from '@/store/useStore'
import Peer from 'peerjs'
import { Call, CallEnd, Fullscreen, FullscreenExit, Mic, RingVolume, VolumeOff, VolumeUp } from '@mui/icons-material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useWebSocket } from 'next-ws/client'
import { v4 as uuidv4 } from 'uuid'
import { useSession } from 'next-auth/react'
import { stopTracks } from './stopTracks'
import { motion } from 'framer-motion'
import { useVolumeControl } from './useVolumeControl'
import VUMeter from './VUMeter'

const graphModes = ['singleBar', 'multipleBars']

const IncomingCall: React.FC = () => {
  const paperProps = useMemo(() => ({ sx: { maxWidth: 'unset' } }), [])

  const [graphMode, setGraphMode] = useState<'singleBar' | 'multipleBars'>('singleBar')
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null)
  const [fullScreen, setFullScreen] = useState(false)
  const toggleFullScreen = () => setFullScreen(!fullScreen)

  const myVideoRef = useRef<HTMLVideoElement>(null)
  const callingVideoRef = useRef<HTMLVideoElement>(null)
  const { volume: myVol, setVolume: setMyVol, handleVolumeChange: handleMyVol, toggleMute: toggleMyMute } = useVolumeControl(1, myVideoRef)
  const { volume: uVol, setVolume: setUVol, handleVolumeChange: handleUVol, toggleMute: toggleUMute } = useVolumeControl(1, callingVideoRef)

  const ringing = useStore((state) => state.ringing)
  const setRinging = useStore((state) => state.setRinging)
  const toggleRinging = () => setRinging(!ringing)
  const incomingCall = useStore((state) => state.dialogs.incomingCall)
  const setOpen = useStore((state) => state.setDialogs)
  const otherCallId = useStore((state) => state.otherCallId)
  const otherAuthorName = useStore((state) => state.otherAuthorName)
  const otherAuthorAvatar = useStore((state) => state.otherAuthorAvatar)
  const imTheCaller = useStore((state) => state.imTheCaller)
  const displayName = useStore((state) => state.displayName)
  const myCallId = useStore((state) => state.myCallId)
  const inCall = useStore((state) => state.inCall)
  const setInCall = useStore((state) => state.setInCall)
  const dev = useStore((state) => state.dev)

  const { data: session } = useSession()
  const ws = useWebSocket()

  const handleClose = () => {
    setOpen('incomingCall', false)
    setRinging(false)
  }

  const acceptCall = () => {
    setRinging(false)
    setInCall(true)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      const call = peerInstance?.call(otherCallId, stream)
      if (call) {
        call.answer(stream)
        call.on('stream', (userVideoStream) => {
          if (callingVideoRef.current) {
            callingVideoRef.current.srcObject = userVideoStream
          }
        })
      }
    })
    ws?.send(
      JSON.stringify({
        type: 'videocall-accepted',
        callerId: myCallId,
        recipients: myCallId,
        msgId: uuidv4(),
        authorAvatar: session?.user.image
      })
    )
  }

  const rejectCall = () => {
    setRinging(false)
    setOpen('incomingCall', false)
    const msg = JSON.stringify({
      type: 'videocall-rejected',
      callerId: myCallId
    })
    ws?.send(msg)
    stopTracks()
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

      if (typeof window !== 'undefined' && incomingCall) {
        peer = new Peer(myCallId, {
          host: (process.env.NEXT_PUBLIC_PEERJS_URL_DOCKER || 'http://localhost:9000').split(':')[1].replace('//', ''),
          port: parseInt((process.env.NEXT_PUBLIC_PEERJS_URL_DOCKER || 'http://localhost:9000').split(':')[2]),
          path: '/'
        })

        setPeerInstance(peer)

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream
            ;(window as any).streamA = stream
          }

          peer.on('call', (call) => {
            call.answer(stream)
            call.on('stream', (userVideoStream) => {
              if (callingVideoRef.current) {
                callingVideoRef.current.srcObject = userVideoStream
                ;(window as any).streamB = userVideoStream
              }
            })
          })
        })
      } else {
        stopTracks()
      }
      return () => {
        if (peer) peer.destroy()
        stopTracks()
      }
    }
  }, [incomingCall, myCallId, setPeerInstance])

  const isMobile = useMediaQuery('(max-width: 600px)')

  return (
    <Dialog PaperProps={paperProps} fullScreen={fullScreen || isMobile} open={incomingCall && otherCallId !== ''} onClose={handleClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <motion.div animate={{ scale: ringing ? [1.3, 1] : 1 }} transition={{ duration: 0.5, repeat: ringing ? Infinity : 1 }}>
          <Avatar src={otherAuthorAvatar} sx={{ mr: 2 }}>
            {otherAuthorAvatar ? null : otherAuthorName.charAt(0)}
          </Avatar>
        </motion.div>
        <Typography sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
          {inCall ? `in call with ${otherAuthorName}` : imTheCaller ? `calling ${otherAuthorName}` : `${otherAuthorName} is calling`}
        </Typography>
      </DialogTitle>
      <IconButton onClick={toggleRinging} sx={{ position: 'absolute', top: '1rem', right: '5rem' }}>
        {ringing ? <VolumeOff /> : <RingVolume />}
      </IconButton>

      <IconButton onClick={toggleFullScreen} sx={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        {fullScreen ? <FullscreenExit /> : <Fullscreen />}
      </IconButton>
      <DialogContent sx={{ padding: isMobile ? 0 : '' }}>
        <Paper
          sx={{
            overflow: 'hidden',
            padding: 0,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row'
          }}
        >
          <Grid container spacing={0} minWidth={640} minHeight={250}>
            <Grid item xs={12} md={inCall || fullScreen ? 6 : 12}>
              <VideoFrame callingVideoRef={myVideoRef} name={displayName} muted graphMode={graphMode} />
            </Grid>
            {inCall && (
              <Grid item xs={12} md={6}>
                <VideoFrame callingVideoRef={callingVideoRef} name={otherAuthorName} />
              </Grid>
            )}
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Stack direction='column' spacing={2} width={'100%'} pl={2} pr={2}>
          <Stack direction='row' spacing={5} alignItems={'center'}>
            <Stack direction='column' spacing={0} alignItems={'flex-start'} flexGrow={1}>
              <Stack direction='row' spacing={0} alignItems={'center'} flexGrow={1} width={fullScreen ? '46%' : '98%'}>
                <IconButton onClick={toggleMyMute}>
                  <Mic />
                </IconButton>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={myVol || 1}
                  onChange={(_e, v) => {
                    handleMyVol(v)
                    setMyVol(v)
                  }}
                />
              </Stack>
              {dev && (
                <Stack direction='row' spacing={0} alignItems={'center'} flexGrow={1}>
                  <Select value={graphMode} onChange={(e) => setGraphMode(e.target.value as any)}>
                    {graphModes.map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        {mode}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              )}
            </Stack>

            {inCall && (
              <Stack direction='row' spacing={0} alignItems={'center'} flexGrow={1} pr={2}>
                <IconButton onClick={toggleUMute}>
                  <VolumeUp />
                </IconButton>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={uVol || 1}
                  onChange={(_e, v) => {
                    handleUVol(v)
                    setUVol(v)
                  }}
                />
              </Stack>
            )}
          </Stack>

          <Stack direction='row' spacing={2} alignItems={'center'} justifyContent={imTheCaller || inCall ? 'center' : 'flex-end'} flexGrow={1}>
            <Button startIcon={<CallEnd />} variant='contained' color='error' onClick={rejectCall}>
              {imTheCaller || inCall ? 'Hang up' : 'Reject'}
            </Button>
            {!imTheCaller && !inCall && (
              <Button startIcon={<Call />} color='primary' variant='contained' onClick={acceptCall}>
                Accept
              </Button>
            )}
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default IncomingCall
