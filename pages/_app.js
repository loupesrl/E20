import '../styles/globals.css'
import Header from '../components/Header'
import { Provider as SelfIDProvider } from '@self.id/framework'
import { CERAMIC_NETWORK } from '../constants'

function MyApp({ Component, pageProps }) {
  return (
    <SelfIDProvider client={{ ceramic: CERAMIC_NETWORK }}>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <Component {...pageProps} />
      </div>
    </SelfIDProvider>
  )
}

export default MyApp
