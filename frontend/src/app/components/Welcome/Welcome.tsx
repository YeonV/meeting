'use client'

import { Box, Typography, Grid, Stack } from '@mui/material'
import { useSession } from 'next-auth/react'
import useTranslation from '@/lib/utils'
import useStore from '@/store/useStore'
import Logos from './Logos/Logos'
import SignInButton from './SignInButton'
import MuiLogo from './Logos/MuiLogo'
import Image from 'next/image'
import Logo from './Logos/Logo'
import NotifyDoc from './NotifyDoc'
import Features from './Features'
import Swiper from './Swiper'
import FeatureContent from './FeaturesContent'

const Welcome = ({ notify }: { notify: () => void }) => {
  const dev = useStore((state) => state.dev)
  const darkMode = useStore((state) => state.darkMode)
  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)
  const { data: session } = useSession()

  return (
    <Box flex={1} display='flex' justifyContent='center' alignItems='center' flexDirection={'column'}>
      <Grid container maxWidth={1200}>
        <Grid item xs={12} md={6} p={4} sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
          <Typography variant='h4' color={'GrayText'}>
            {t('welcome-title-overline')}
          </Typography>
          <Typography variant='h1'>{t('welcome-title')}</Typography>
          <Typography color={'GrayText'} fontWeight={100} mt={6} variant='h5'>
            {t('welcome-description')}
          </Typography>
          <SignInButton />
        </Grid>
        <Logos />
      </Grid>

      <Stack mt={16} maxWidth={1200} minWidth={100} justifyContent={'center'} textAlign={'center'}>
        {session && session.user ? (
          'Authenticated Section'
        ) : (
          <>
            <Typography variant='h2' mt={0} mb={6}>
              Getting Started
            </Typography>
            <Typography variant='h4' color={'GrayText'} mb={16} mt={2}>
              <code style={{ backgroundColor: '#000', padding: '1.4rem 4rem', borderRadius: 20 }}>{`npx create-nextws@latest`}</code>
            </Typography>
          </>
        )}

        <Typography variant='h2' mt={0} mb={4}>
          Examples
        </Typography>
        <Grid container maxWidth={1200}>
          <Grid item xs={12} md={4} p={2} textAlign={'left'}>
            <FeatureContent
              title='Chat'
              subtitle='Realtime client-to-client websocket communication via NextWs'
              points={['Private messaging', 'Group messaging', 'Reactions', 'Emojis']}
              value={0}
              index={0}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Swiper />
          </Grid>
        </Grid>
        <Grid container maxWidth={1200} mt={8}>
          <Grid item xs={12} md={8}>
            <Swiper />
          </Grid>
          <Grid item xs={12} md={4} p={2} pl={6} textAlign={'left'}>
            <FeatureContent
              title='Meetings'
              subtitle='Meeting scheduling and management via Strapi and NextAuth'
              points={['Create meetings', 'Join meetings', 'Invite users', 'Realtime updates']}
              value={0}
              index={0}
            />
          </Grid>
        </Grid>
        <Typography variant='h2' mb={6} mt={12}>
          Features
        </Typography>
        <Features />

        <NotifyDoc />
        <Typography variant='h2' mt={16} mb={4}>
          Project Structure
        </Typography>
        <Image src='/folder-structure-detailed.png' alt='folder-structure' width='325' height='1069' style={{ margin: '0 auto' }} />

        <Typography variant='h2' mt={16} mb={4}>
          Codes of interest
        </Typography>
        <p>Coming soon</p>

        {dev && (
          <button style={{ display: 'none' }} onClick={() => notify()}>
            notify test
          </button>
        )}
      </Stack>
    </Box>
  )
}

export default Welcome
