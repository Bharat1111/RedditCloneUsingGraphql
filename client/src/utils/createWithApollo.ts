import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { IncomingHttpHeaders } from "http";
import fetch from "isomorphic-unfetch";
import { AppProps } from "next/app";
import { useMemo } from "react";

const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

export const createApolloClient = (initialState, headers: IncomingHttpHeaders | null = null) => {
  const enhancedFetch = (url: RequestInfo, init: RequestInit) => {
    // console.log('initial headers', init)
    return fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        "Access-Control-Allow-Origin": "*",
        Cookie: headers?.cookie ?? "",
      },
      
    }).then((response) => response);
  };
  
  // console.log('headers after creating apollo client', headers)
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: ApolloLink.from([
      // this uses apollo-link-http under the hood, so all the options here come from that package
      createHttpLink({
        uri: "http://localhost:3001/graphql",
        fetchOptions: {
          mode: "cors",
        },
        credentials: "include",
        fetch: enhancedFetch,
      }),
    ]),
    cache: new InMemoryCache(),
  });
};

type InitialState = NormalizedCacheObject | undefined;

interface IInitializeApollo {
  headers?: IncomingHttpHeaders | null;
  initialState?: InitialState | null;
}

export const initializeApollo = (
  { headers, initialState }: IInitializeApollo = { headers: null, initialState: null }
) => {
  // console.log('headers',headers);
  
  const _apolloClient = apolloClient ?? createApolloClient(headers);

  // console.log('apollo client', _apolloClient)

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
  //   // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

  //   // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    // const data = merge(initialState, existingCache, {
  //   //   // combine arrays using object equality (like in sets)
      // arrayMerge: (destinationArray, sourceArray) => [
      //   ...sourceArray,
      //   ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s))),
  //   //   ],
    // });
    const data = initialState

  //   // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: AppProps["pageProps"]
) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
};

export function useApollo(pageProps: AppProps["pageProps"]) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo({ initialState: state }), [state]);
  return store;
}