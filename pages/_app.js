import '../styles/globals.css'
import '../styles/dialog-transition.css'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useRouter } from "next/router";
import { IntercomProvider } from 'react-use-intercom';
import { Analytics } from '@vercel/analytics/react';

const getLibrary = () => {
  const provider = window.web3.currentProvider
  return new Web3Provider(provider)
}

const INTERCOM_APP_ID = 'h5zisg78'

function App({ Component, pageProps }) {
  const router = useRouter()
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <IntercomProvider appId={INTERCOM_APP_ID}>
        <Component key={router.asPath} {...pageProps} />
        <Analytics />
      </IntercomProvider>
    </Web3ReactProvider>)
}

export default App