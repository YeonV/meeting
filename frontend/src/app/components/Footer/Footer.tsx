'use client'

import { Typography, useTheme } from '@mui/material'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import useStore from '@/store/useStore'

const Footer = () => {
  const theme = useTheme()
  const darkMode = useStore((state) => state.darkMode)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='sticky' sx={{ bottom: 0 }} color='inherit'>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Typography variant='body2' color='GrayText'>
            created by Blade
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Footer
