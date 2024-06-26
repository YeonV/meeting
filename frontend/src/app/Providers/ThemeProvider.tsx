'use client'

import useStore from '@/store/useStore'
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'
import { useMemo } from 'react'

type Props = {
  children?: React.ReactNode
}

export const ThemeProvider = ({ children }: Props) => {
  const darkMode = useStore((state) => state.darkMode)
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#005c4b'
          },
          secondary: {
            main: '#ff6f00'
          }
        },
        components: {
          MuiButton: {
            defaultProps: {
              variant: 'text',
              color: 'inherit'
            },
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 300,
                padding: '0.4rem 2rem',
                fontSize: 18,
                borderRadius: 22,
                borderColor: 'rgba(128, 128, 128, 0.4)'
              }
            }
          }
        }
      }),
    [darkMode]
  )
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
