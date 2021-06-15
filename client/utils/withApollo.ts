import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createWithApollo } from './createWithApollo'
import { NextPageContext } from "next";

const createClient = (ctx: NextPageContext) => new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  credentials: "include",
  headers: {
    cookie: (typeof window === "undefined" ? ctx.req.headers.cookie : undefined) || ''
  },
  cache: new InMemoryCache(),
})

export const withApollo = createWithApollo(createClient)