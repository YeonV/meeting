import { useClient } from '@/lib/useClient'
import { Download } from '@mui/icons-material'
import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'

const InstallButton = ({ style }: { style?: React.CSSProperties }) => {
  const [supportsPWA, setSupportsPWA] = useState<boolean>(false)
  const [promptInstall, setPromptInstall] = useState<any | null>(null)
  const { isIos } = useClient()

  useEffect(() => {
    const handler = (e: any) => {
      // e.preventDefault()
      setSupportsPWA(true)
      setPromptInstall(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const onClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    if (!promptInstall) {
      return
    }
    promptInstall.prompt()
  }
  if (isIos) {
    return (
      <Button
        startIcon={<Download />}
        variant='contained'
        color='primary'
        style={style}
        onClick={() => alert('To install this app, tap Share and then "Add to Home Screen"')}
      >
        Install
      </Button>
    )
  }
  if (!supportsPWA) {
    return null
  }
  return (
    <Button startIcon={<Download />} variant='contained' color='primary' style={style} onClick={onClick}>
      Install
    </Button>
  )
}

export default InstallButton
