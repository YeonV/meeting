'use client'

import { Typography, Stack } from '@mui/material'

import useStore from '@/store/useStore'

import MuiLogo from './MuiLogo'
import Image from 'next/image'

const Logo = ({ name, text }: { name: string; text?: boolean }) => {
  const darkMode = useStore((state) => state.darkMode)

  const Content = () => {
    switch (name) {
      case 'MaterialUI':
        return (
          <>
            <MuiLogo />
            {text && <Typography variant='h5'>MaterialUI</Typography>}
          </>
        )
      case 'Zustand':
        return (
          <>
            <Image src='/Logos/zustand.png' alt='zustand' width={30} height={30} style={{ filter: darkMode ? 'none' : 'invert(1)' }} />
            {text && <Typography variant='h5'>Zustand</Typography>}
          </>
        )
      case 'NextAuth':
        return (
          <>
            <Image src='/Logos/nextauth.png' alt='nextauth' width={30} height={30} style={{ filter: darkMode ? 'grayscale(1)' : 'grayscale(1)' }} />
            {text && <Typography variant='h5'>NextAuth</Typography>}
          </>
        )
      case 'NextWs':
        return (
          <>
            <Image src='/Logos/NextWs.png' alt='nextws' width={30} height={30} style={{ filter: darkMode ? 'invert(1)' : 'grayscale(1)' }} />
            {text && <Typography variant='h5'>NextWs</Typography>}
          </>
        )

      default:
        break
    }
  }
  return (
    <Stack direction='row' spacing={2} alignSelf={'center'} minWidth={180} mt={4}>
      <Content />
    </Stack>
  )
}

export default Logo
