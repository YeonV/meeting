'use client'

import { useEffect, useRef, useState } from 'react'

import { Button, Grid, InputBase, Paper, Typography, useMediaQuery } from '@mui/material'
import Peer from 'peerjs'
import useStore from '@/store/useStore'

const VideoChat = () => {
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const callingVideoRef = useRef<HTMLVideoElement>(null)

  const [peerInstance, setPeerInstance] = useState<Peer | null>(null)
  const [idToCall, setIdToCall] = useState('')
  const myCallId = useStore((state) => state.myCallId)
  const setMyCallId = useStore((state) => state.setMyCallId)

  const generateRandomString = () => Math.random().toString(36).substring(2)

  const handleCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      const call = peerInstance?.call(idToCall, stream)
      if (call) {
        call.on('stream', (userVideoStream) => {
          if (callingVideoRef.current) {
            callingVideoRef.current.srcObject = userVideoStream
          }
        })
      }
    })
  }

  useEffect(() => {
    if (myCallId) {
      let peer: Peer
      if (typeof window !== 'undefined') {
        peer = new Peer(myCallId, {
          host: 'localhost',
          port: 9000,
          path: '/myapp'
        })

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

      return () => {
        if (peer) {
          peer.destroy()
        }
      }
    }
  }, [myCallId])

  useEffect(() => {
    setMyCallId(generateRandomString())
  }, [])

  const isMobile = useMediaQuery('(max-width: 600px)')

  return (
    <Paper sx={{ padding: 3, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant='h6'>Your ID: {myCallId}</Typography>
          <video playsInline ref={myVideoRef} autoPlay style={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputBase sx={{ width: '100%', mb: 2 }} placeholder='ID to call' value={idToCall} onChange={(e) => setIdToCall(e.target.value)} />
          <Button variant='contained' onClick={handleCall} disabled={!idToCall}>
            Call
          </Button>
          <video playsInline ref={callingVideoRef} autoPlay style={{ width: '100%' }} />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default VideoChat
