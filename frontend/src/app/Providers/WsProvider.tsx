'use client'

import { WebSocketProvider } from 'next-ws/client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { encrypt } from '../actions'
import useStore from '@/store/useStore'
import DisplayName from '../components/DisplayName'

const WsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession()
  const [encyptedUserId, setEncyptedUserId] = useState<string>('server')

  const displayName = useStore((state) => state.displayName)

  useEffect(() => {
    const init = async () => {
      const user = {
        id: session?.user.email || 'unknown' || session?.user.name?.replace('#', '-') || 'unknown',
        displayName: displayName,
        name: session?.user.name || 'unknown',
        email: session?.user.email || 'unknown'
      }
      // console.log('user:', user)
      const enc_user = await encrypt(user)
      // console.log('enc_user:', enc_user)
      setEncyptedUserId(enc_user)
    }
    if ((session?.user.email || session?.user.name?.replace('#', '-')) && displayName !== '') {
      init()
    }
  }, [displayName, session])

  // const protocol = process.env.NEXT_PUBLIC_NEXTJS_URL?.split('://')[0]
  // const host = process.env.NEXT_PUBLIC_NEXTJS_URL?.split('://')[1].replace(/\/$/, '')
  const protocol = window.location.href?.split('://')[0]
  const host = window.location.href?.split('://')[1].replace(/\/$/, '')
  const proto = protocol === 'https' ? 'wss' : 'ws'

  if (displayName === '') return <DisplayName />
  return encyptedUserId !== 'server' ? (
    <WebSocketProvider url={`${proto}://${host}/api/socket?userId=${encodeURIComponent(encyptedUserId)}`}>
      {/* <WebSocketProvider url={`ws://localhost:3000/api/socket?userId=${encodeURIComponent(encyptedUserId)}`}> */}
      {children}
    </WebSocketProvider>
  ) : (
    <div>loading...</div>
  )
}

export default WsProvider
