import type { AppProps } from 'next/app'
import { Suspense } from 'react'
import { createClient, Provider } from 'wagmi'
import AppHeader from '../components/AppHeader'
import '../styles/globals.css'

const client = createClient({
  autoConnect: true,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Suspense fallback="Loading">
      <Provider client={client}>
        <AppHeader />
        <Component {...pageProps} />
      </Provider>
    </Suspense>
  )
}

export default MyApp
