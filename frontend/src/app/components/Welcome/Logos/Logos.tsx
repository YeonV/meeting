'use client'

import Image from 'next/image'
import NextJsText from './NextJsText'
import WsLogo from './WsLogo'
import NextText from './NextText'
import StrapiLogo from './StrapiLogo'
import DockerLogo from './DockerLogo'
import { Typography, useMediaQuery } from '@mui/material'
import useStore from '@/store/useStore'
import Grid from '../../Motion/Grid'
import Stack from '../../Motion/Stack'
import { staggerContainer, staggerItem } from '../../Motion/Stagger'


const Logos = () => {
  const lg = useMediaQuery('(max-width: 1200px)')
  const md = useMediaQuery('(max-width: 900px)')
  const darkMode = useStore((state) => state.darkMode)

  return (
    <Grid item xs={12} md={6} p={4} sx={{ opacity: darkMode ? 1 : 0.7 }} {...staggerContainer('x')}>
      <Stack mt={4} direction='row' spacing={4} {...staggerItem('x')} alignItems={'center'}>
        <Image src='/nextjsLogo.svg' alt='nextjs' width={77} height={77} />
        <NextJsText />
      </Stack>

      <Stack mt={4} ml={md ? 0 : lg ? 3 : 10} direction='row' spacing={4} alignItems={'center'} sx={{ transition: 'margin 0.25s ease' }} {...staggerItem('x')}>
        <WsLogo />
        <Stack direction='row' alignItems={'flex-end'} sx={{ position: 'relative' }}>
          <NextText />
          <Typography sx={{ position: 'absolute', right: 14, bottom: -5, fontSize: 18, fontWeight: 900, transform: 'scaleY(1.32)' }}>W</Typography>
        </Stack>
      </Stack>

      <Stack mt={4} ml={md ? 0 : lg ? 6 : 20} sx={{ transition: 'margin 0.25s ease' }} {...staggerItem('x')}>
        <StrapiLogo />
      </Stack>

      <Stack mt={4} ml={md ? 0 : lg ? 9 : 30} sx={{ transition: 'margin 0.25s ease' }} {...staggerItem('x')}>
        <DockerLogo />
      </Stack>
    </Grid>
  )
}

export default Logos
