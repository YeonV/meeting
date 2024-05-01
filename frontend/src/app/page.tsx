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
// import WsChat from './components/WsChat'

// import { headers } from 'next/headers'
// import Script from 'next/script'

export const dynamic = 'force-dynamic'

export default function Home(a: any) {
  // const nonce = headers().get('x-nonce') || undefined
  const { data: session } = useSession()

  const userId = session?.user.email || session?.user.name?.replace('#', '-') || 'unknown'
  // return <Script src='https://...' strategy='afterInteractive' nonce={nonce} />

  // remove the protocol from the url and remove the trailing slash

  const protocol = process.env.NEXT_PUBLIC_NEXTJS_URL?.split('://')[0]
  const host = process.env.NEXT_PUBLIC_NEXTJS_URL?.split('://')[1].replace(/\/$/, '')
  const proto = protocol === 'https' ? 'wss' : 'ws'

  return (
    <main className={styles.main}>
      <WebSocketProvider url={`${proto}://${host}/api/socket?userId=${userId}`}>
        <Content />
        <Session />
        {/* <WsChat /> */}
      </WebSocketProvider>
    </main>
  )
}
