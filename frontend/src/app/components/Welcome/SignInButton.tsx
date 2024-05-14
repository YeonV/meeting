'use client'

import { Button } from '@mui/material'
import { signIn, useSession } from 'next-auth/react'
import { CheckCircle } from '@mui/icons-material'
import useTranslation from '@/lib/utils'
import useStore from '@/store/useStore'

const SignInButton = () => {
  const darkMode = useStore((state) => state.darkMode)
  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)
  const { data: session } = useSession()

  return session && session.user ? (
    <>
      <Button
        disabled
        startIcon={<CheckCircle sx={{ marginBottom: '2px' }} />}
        variant='contained'
        size='large'
        color={darkMode ? 'inherit' : 'primary'}
        onClick={() => signIn()}
        sx={{ mr: 'auto', mt: 4 }}
      >
        {t('welcome-signed-in')}
      </Button>
    </>
  ) : (
    <>
      <Button variant='contained' size='large' color={'primary'} onClick={() => signIn()} sx={{ mr: 'auto', mt: 4 }}>
        {t('welcome-sign-in')}
      </Button>
    </>
  )
}

export default SignInButton
