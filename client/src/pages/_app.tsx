import '../styles/globals.css'
import { Fragment } from 'react'
import { useRouter } from 'next/router'

import Navbar from '../components/Navbar'

function MyApp({ Component, pageProps }: any) {
  const { pathname } = useRouter()
  const authRoutes = ['/register', '/login']
  const authRoute = authRoutes.includes(pathname)
  return (

    <Fragment>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </Fragment>
  )
}

export default MyApp
