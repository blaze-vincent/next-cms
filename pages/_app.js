import Layout from '../components/layout/layout'
import '../globals.css'

function MyApp({ Component, pageProps }) {
  return <Layout><Component {...pageProps} /></Layout>
}

export default MyApp
