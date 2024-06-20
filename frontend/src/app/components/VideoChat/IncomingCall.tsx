import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
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
import { Call, CallEnd, FeaturedVideo, Fullscreen, FullscreenExit, Mic, MicOff, MusicNote, MusicOff, RingVolume, Settings, Splitscreen, VolumeOff, VolumeUp } from '@mui/icons-material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useWebSocket } from 'next-ws/client'
import { v4 as uuidv4 } from 'uuid'
import { useSession } from 'next-auth/react'
import { stopTracks } from './stopTracks'
import { motion } from 'framer-motion'
import { useVolumeControl } from './useVolumeControl'
import VUMeter from './VUMeter'
import useAudio from './useAudio'

const graphModes = ['singleBar', 'multipleBars']

const IncomingCall: React.FC = () => {
  const paperProps = useMemo(() => ({ sx: { maxWidth: 'unset' } }), [])

  const [graphMode, setGraphMode] = useState<'singleBar' | 'multipleBars'>('singleBar')
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null)
  const [fullScreen, setFullScreen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [splitScreen, setSplitScreen] = useState(false)

  const toggleFullScreen = () => setFullScreen(!fullScreen)
  const toggleSettings = () => setSettingsOpen(!settingsOpen)
  const toggleSplitScreen = () => setSplitScreen(!splitScreen)

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
  const { play, stop } = useAudio(imTheCaller ? '/audio/call/outgoing.mp3' : '/audio/call/incoming.mp3', true, () => !ringing);

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
        // authorAvatar: session?.user.image,
        authorName: displayName
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
    if (incomingCall && ringing) {
      play();
    } else {
      stop();
    }
  }, [incomingCall, ringing, play, stop, imTheCaller]);

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
        stopTracks()
      }
      return () => {
        if (peer) peer.destroy()
        stopTracks()
      }
    }
  }, [incomingCall, myCallId, splitScreen])

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

      {!isMobile && <IconButton onClick={toggleFullScreen} sx={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        {fullScreen ? <FullscreenExit /> : <Fullscreen />}
      </IconButton>}
      <DialogContent sx={{ padding: isMobile ? 0 : '' }}>
        <Paper
          sx={{
            overflow: 'hidden',
            padding: 0,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            height: '100%'
          }}
        >
          <Grid className='dragContainer' container spacing={0} minWidth={isMobile ? 320 : 640} minHeight={250} flexGrow={1} position={'relative'}>
            {inCall && (

              <Grid item xs={12} md={6} position={isMobile && !splitScreen ? 'absolute' : 'relative'} top={0} left={0} right={0} bottom={0} >
                <Box height={'100%'}>
                  <VideoFrame callingVideoRef={callingVideoRef} name={otherAuthorName} graphMode={graphMode} splitScreen={isMobile && splitScreen} />
                </Box>
              </Grid>
            )}
            <Grid item xs={12} md={inCall ? 6 : 12} position={isMobile && !splitScreen ? 'absolute' : 'relative'} top={0} left={0} right={0} bottom={15}>
              <Box>
                <VideoFrame callingVideoRef={myVideoRef} name={displayName} muted graphMode={graphMode} dnd={isMobile && !splitScreen} splitScreen={isMobile && splitScreen} me />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Stack direction='column' spacing={2} width={'100%'} pl={2} pr={2}>
          {(!isMobile || settingsOpen) && <Stack direction='row' spacing={5} alignItems={'center'}>
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
          </Stack>}

          <Stack direction='row' spacing={2} alignItems={'center'} justifyContent={imTheCaller || inCall || isMobile ? 'center' : 'flex-end'} flexGrow={1}>

            {isMobile
              ? <>
                {<Fab disabled={inCall} size='small' color={'default'} onClick={toggleSplitScreen}>
                  {splitScreen ? <Splitscreen /> : <FeaturedVideo />}
                </Fab>}
            
                {inCall && <Fab size='small' color={myVol as number < 0.02 ? 'error' : 'default'} onClick={toggleMyMute}>
                  {myVol as number < 0.02 ? <MicOff /> : <Mic />}
                </Fab>}


                {!imTheCaller && !inCall && (
                  <Fab color='primary' onClick={acceptCall}>
                    <Call />
                  </Fab>
                )}
                <Fab color='error' onClick={rejectCall}>
                  <CallEnd />
                </Fab>
                {!inCall && <Fab size='small' color={ringing ? 'default' : 'error'} onClick={toggleRinging}>
                  {ringing ? <RingVolume /> : <MusicNote />}
                </Fab>}
                {inCall && <Fab size='small' color={uVol as number < 0.02 ? 'error' : 'default'} onClick={toggleUMute}>
                {uVol as number < 0.02 ? <VolumeOff /> : <VolumeUp />}
                </Fab>}
               
                 {inCall && <Fab size='small' color={settingsOpen ? 'primary' : 'default'} onClick={toggleSettings}>
                  <Settings />
                </Fab>}
              </>
              : <>
                {!inCall && <Button startIcon={ringing ? <MusicOff /> : <MusicNote />} variant='contained' color={ringing ? 'error' : 'primary'} onClick={toggleRinging}>
                  {ringing ? 'Mute' : 'Unmute'}
                </Button>}
                <Button startIcon={<CallEnd />} variant='contained' color='error' onClick={rejectCall}>
                  {imTheCaller || inCall ? 'Hang up' : 'Reject'}
                </Button>
                {!imTheCaller && !inCall && (
                  <Button startIcon={<Call />} color='primary' variant='contained' onClick={acceptCall}>
                    Accept
                  </Button>
                )}
              </>}
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default IncomingCall
