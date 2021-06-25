import { ApolloProvider } from '@apollo/client';
import '../styles/globals.css'
import { useApollo } from '../utils/createWithApollo';

function MyApp({ Component, pageProps }: any) {
  const client = useApollo(pageProps)
  return (
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
  )
}

export default MyApp
