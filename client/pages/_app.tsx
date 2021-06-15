import '../styles/globals.css'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const createClient = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  // credentials: "include",
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={createClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
