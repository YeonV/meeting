import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import VideoChat from './VideoChat'

interface IncomingCallProps {
  callerId: string
  onAccept: () => void
  onReject: () => void
}

const IncomingCall: React.FC<IncomingCallProps> = ({ callerId, onAccept, onReject }) => {
  const [open, setOpen] = useState(true)
  const [ringing, setRinging] = useState(true)

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const audio = new Audio('/call.mp3') // Replace with your ringtone path
    let intervalId: any

    if (ringing) {
      audio.play().catch(() => console.warn('Ringtone failed to play'))
      intervalId = setInterval(() => audio.play().catch(() => console.warn('Ringtone failed to play')), 3000)
    }

    return () => {
      clearInterval(intervalId)
      audio.pause()
    }
  }, [ringing])

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <motion.div animate={{ scale: ringing ? [1.3, 1] : 1 }} transition={{ duration: 0.5, repeat: ringing ? Infinity : 1 }}>
          <Avatar sx={{ mr: 2 }}>{/* Display caller's avatar here (if available) */}</Avatar>
        </motion.div>
        <Typography variant='h6'>{callerId} is calling</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Would you like to accept the call?</DialogContentText>

        <VideoChat />
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='error' onClick={onReject}>
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
