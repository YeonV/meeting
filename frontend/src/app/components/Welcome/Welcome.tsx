'use client'

import { IconButton } from '@mui/material'
import { useCopyToClipboard } from 'usehooks-ts'
import { useSession } from 'next-auth/react'
import useTranslation from '@/lib/utils'
import useStore from '@/store/useStore'
import Logos from './Logos/Logos'
import SignInButton from './SignInButton'
import Image from 'next/image'
import NotifyDoc from './NotifyDoc'
import Features from './Features'
import Swiper from './Swiper'
import FeatureContent from './FeaturesContent'
import { CopyAll } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import Typography from '../Motion/Typography'
import Stack from '../Motion/Stack'
import Box from '../Motion/Box'
import Grid from '../Motion/Grid'
import { StaggerGrid } from '../Motion/StaggerGrid'
import IncomingCall from '../VideoChat/IncomingCall'
const Welcome = ({ notify }: { notify: () => void }) => {
  const dev = useStore((state) => state.dev)
  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const { data: session } = useSession()
  const [_copiedText, copy] = useCopyToClipboard()
  const c = () => {
    copy('npx create-nextws@latest')
    enqueueSnackbar('Copied to clipboard', { variant: 'success' })
  }

  return (
    <Box flex={1} display='flex' justifyContent='center' alignItems='center' flexDirection={'column'}>
      <IncomingCall callerId='John Doe' onAccept={() => {}} onReject={() => {}} />
      <Grid container maxWidth={1200}>
        {/* <Grid item xs={12} md={6} p={4} sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }} {...staggerContainer('y', 1.5)}>
          <Typography variant='h4' color={'GrayText'} {...staggerItem()}>
            {t('welcome-title-overline')}
          </Typography>
          <Typography variant='h1' {...staggerItem()}>
            {t('welcome-title')}
          </Typography>
          <Typography color={'GrayText'} fontWeight={100} mt={6} variant='h5' {...staggerItem()}>
            {t('welcome-description')}
          </Typography>
          <Box {...staggerItem()}>
            <SignInButton />
          </Box>
        </Grid> */}
        <StaggerGrid item xs={12} md={6} p={4} sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
          <Typography variant='h4' color={'GrayText'}>
            {t('welcome-title-overline')}
          </Typography>
          <Typography variant='h1'>{t('welcome-title')}</Typography>
          <Typography color={'GrayText'} fontWeight={100} mt={6} variant='h5'>
            {t('welcome-description')}
          </Typography>
          <Box>
            <SignInButton />
          </Box>
        </StaggerGrid>

        <Logos />
      </Grid>

      <Stack
        mt={16}
        maxWidth={1200}
        minWidth={100}
        justifyContent={'center'}
        textAlign={'center'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 3 } }}
      >
        {session && session.user ? (
          'Authenticated Section'
        ) : (
          <Box>
            <Typography variant='h2' mt={0} mb={6}>
              Getting Started
            </Typography>
            <Typography
              variant='h4'
              color={'GrayText'}
              mb={16}
              mt={2}
              sx={{ '&:hover': { color: '#ddd' } }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <code onClick={c} style={{ backgroundColor: '#000', padding: '1.4rem 4rem', borderRadius: 20, position: 'relative', cursor: 'pointer' }}>
                {`npx create-nextws@latest`}
                <IconButton color='inherit' size='small' style={{ position: 'absolute', right: 12, top: 26 }}>
                  <CopyAll color='inherit' />
                </IconButton>
              </code>
            </Typography>
          </Box>
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
