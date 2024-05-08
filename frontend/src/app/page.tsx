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
import Content from './components/Content/Content'

export const dynamic = 'force-dynamic'

export default function Home(a: any) {
  return (
    <main className={styles.main}>
      <Content />
      <Session />
    </main>
  )
}
