import type { AppProps } from 'next/app'
import { createClient, Provider } from 'wagmi'
import AppHeader from '../components/AppHeader'
import '../styles/globals.css'

const client = createClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider client={client}>
      <AppHeader />
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
