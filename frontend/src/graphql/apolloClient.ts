import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { store } from '../store';
import { HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'include',
});

const authLink = new SetContextLink((prevContext) => {
  const token = store.getState().auth.token;
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : undefined,
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'none' },
    query: { errorPolicy: 'none' },
    mutate: { errorPolicy: 'none' },
  },
});

export default apolloClient;
