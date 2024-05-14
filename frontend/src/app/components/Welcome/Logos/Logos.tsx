'use client'

import Image from 'next/image'
import NextJsText from './NextJsText'
import WsLogo from './WsLogo'
import NextText from './NextText'
import StrapiLogo from './StrapiLogo'
import DockerLogo from './DockerLogo'
import { Typography, Stack, Grid, useMediaQuery } from '@mui/material'
import useStore from '@/store/useStore'

const Logos = () => {
  const lg = useMediaQuery('(max-width: 1200px)')
  const md = useMediaQuery('(max-width: 900px)')
  const darkMode = useStore((state) => state.darkMode)

  return (
    <Grid item xs={12} md={6} p={4} sx={{ opacity: darkMode ? 1 : 0.7 }}>
      <Stack mt={4} direction='row' spacing={4} alignItems={'center'}>
        <Image src='/nextjsLogo.svg' alt='nextjs' width={77} height={77} />
        <NextJsText />
      </Stack>

      <Stack mt={4} ml={md ? 0 : lg ? 3 : 10} direction='row' spacing={4} alignItems={'center'} sx={{ transition: 'margin 0.25s ease' }}>
        <WsLogo />
        <Stack direction='row' alignItems={'flex-end'} sx={{ position: 'relative' }}>
          <NextText />
          <Typography sx={{ position: 'absolute', right: 14, bottom: -5, fontSize: 18, fontWeight: 900, transform: 'scaleY(1.32)' }}>W</Typography>
        </Stack>
      </Stack>

      <Stack mt={4} ml={md ? 0 : lg ? 6 : 20} sx={{ transition: 'margin 0.25s ease' }}>
        <StrapiLogo />
      </Stack>

      <Stack mt={4} ml={md ? 0 : lg ? 9 : 30} sx={{ transition: 'margin 0.25s ease' }}>
        <DockerLogo />
      </Stack>
    </Grid>
  )
}

export default Logos
