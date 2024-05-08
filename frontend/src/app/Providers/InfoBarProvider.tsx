'use client'

import { SnackbarProvider } from 'notistack'

const InfoBarProvider = ({ children }: { children: React.ReactNode }) => {
  return <SnackbarProvider>{children}</SnackbarProvider>
}

export default InfoBarProvider
