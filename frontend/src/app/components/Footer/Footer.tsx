'use client'

import { Typography, useTheme } from '@mui/material'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import useStore from '@/store/useStore'
import useTranslation from '@/lib/utils'

const Footer = () => {
  const language = useStore((state) => state.language)
  const { t } = useTranslation(language)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='sticky' sx={{ bottom: 0 }} color='inherit'>
        <Toolbar sx={{ justifyContent: 'flex-end', minHeight: '40px !important' }}>
          <Typography variant='body2' color='GrayText'>
            {t('Footer text')}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Footer
