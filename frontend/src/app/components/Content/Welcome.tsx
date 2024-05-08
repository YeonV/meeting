'use client'

import { Box, Typography, Button } from '@mui/material'
import { signIn } from 'next-auth/react'

import useStore from '@/store/useStore'

const Welcome = ({ notify }: { notify: () => void }) => {
  const darkMode = useStore((state) => state.darkMode)

  return (
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
  )
}

export default Welcome
