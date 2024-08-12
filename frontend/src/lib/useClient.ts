import { useEffect, useState } from 'react'

export function useClient() {
  const [isDesktopPWA, setIsDesktopPWA] = useState(false)
  const [isIosPWA, setIsIosPWA] = useState(false)
  const [isAndroidPWA, setIsAndroidPWA] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isWindows, setIsWindows] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const [isChrome, setIsChrome] = useState(false)
  const [isNotifySupported, setIsNotifySupported] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDesktopPWA(window.matchMedia('(display-mode: standalone)').matches)
      setIsIosPWA((window.navigator as any).standalone)
      setIsAndroidPWA(document.referrer.includes('android-app://'))
      const userAgent = window.navigator.userAgent.toLowerCase()
      setIsIos(/iphone|ipad|ipod/.test(userAgent))
      setIsAndroid(/android/.test(userAgent))
      setIsWindows(/windows/.test(userAgent))
      setIsMac(/macintosh/.test(userAgent))
      setIsChrome(/chrome/.test(userAgent))
      setIsNotifySupported(typeof window !== 'undefined' && 'serviceWorker' in navigator && 'Notification' in window && 'PushManager' in window)
    }
  }, [])

  const isPWA = isDesktopPWA || isIosPWA || isAndroidPWA

  return { isPWA, isDesktopPWA, isIosPWA, isAndroidPWA, isIos, isAndroid, isWindows, isMac, isChrome, isNotifySupported }
}
