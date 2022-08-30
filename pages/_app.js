import '../styles/globals.css'
import { useRouter } from "next/router";



function App({ Component, pageProps }) {
  const router = useRouter()
  return (
        <Component key={router.asPath} {...pageProps} />
  )
}

export default App