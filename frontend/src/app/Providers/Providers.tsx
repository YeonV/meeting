'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from './ThemeProvider'
import InfoBarProvider from './InfoBarProvider'
import { NextAuthProvider } from './SessionProvider'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider>
        <InfoBarProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
        </InfoBarProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}

export default Providers
