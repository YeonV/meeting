'use client'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/source-sans-pro'
import '@fontsource/source-sans-pro/300.css'
import '@fontsource/source-sans-pro/400.css'
import '@fontsource/source-sans-pro/600.css'
import '@fontsource/source-sans-pro/700.css'
import styles from './page.module.css'
import Session from './components/Session'
import Content from './components/Content'
import { WebSocketProvider } from 'next-ws/client'
import { useSession } from 'next-auth/react'
import useStore from '@/store/useStore'
import DisplayName from './components/Chat/DisplayName'
import { encrypt } from './actions'
import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'

export default function Home(a: any) {
  const { data: session } = useSession()
  const [encyptedUserId, setEncyptedUserId] = useState<string>('server')

  const displayName = useStore(state => state.displayName)

  useEffect(() => {
    const init = async () => {
      const user = { 
        id: (session?.user.email || 'unknown') || (session?.user.name?.replace('#', '-') || 'unknown'),
        displayName: displayName,
        name: (session?.user.name || 'unknown'),
        email: (session?.user.email || 'unknown') 
      };
      // console.log('user:', user)
      const enc_user = await encrypt(user)
      // console.log('enc_user:', enc_user)
      setEncyptedUserId(enc_user)
    }
    if ((session?.user.email || session?.user.name?.replace('#', '-'))&& displayName !== '') { 
      init()
    }
  }, [displayName, session])


  const protocol = process.env.NEXT_PUBLIC_NEXTJS_URL?.split('://')[0]
  const host = process.env.NEXT_PUBLIC_NEXTJS_URL?.split('://')[1].replace(/\/$/, '')
  const proto = protocol === 'https' ? 'wss' : 'ws'


  if (displayName === '') return <DisplayName />

  return (
    <main className={styles.main}>
      {encyptedUserId !== 'server' ?<WebSocketProvider url={`${proto}://localhost:3000/api/socket?userId=${encodeURIComponent(encyptedUserId)}`}>
        {/* <WebSocketProvider url={`${proto}://${host}/api/socket?userId=${encyptedUserId}`}> */}
        <Content />
        <Session />
        {/* <WsChat /> */}
      </WebSocketProvider> : <div>loading...</div>}
    </main>
  )
}
