import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';

export function createApolloTestClient() {
  const host = process.env.host;
  const port = process.env.port;
  const url = `http://${host}:${port}/graphql`;
  return new ApolloClient({
    link: new HttpLink({ uri: url, fetch }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'no-cache' },
      query: { fetchPolicy: 'no-cache' },
      mutate: { fetchPolicy: 'no-cache' },
    },
  });
}
