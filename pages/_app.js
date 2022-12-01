import '../styles/globals.css'
import '../styles/dialog-transition.css'
import { useRouter } from "next/router";
import { IntercomProvider } from 'react-use-intercom';
import { Analytics } from '@vercel/analytics/react';

const INTERCOM_APP_ID = 'h5zisg78'

function App({ Component, pageProps }) {
  const router = useRouter()
  return (
    <IntercomProvider appId={INTERCOM_APP_ID}>
      <Component key={router.asPath} {...pageProps} />
      <Analytics />
    </IntercomProvider>)
}

export default App