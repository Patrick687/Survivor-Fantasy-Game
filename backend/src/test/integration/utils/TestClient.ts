import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import fetch from 'cross-fetch';
import { AuthSession } from 'test/integration/generated.types';

export class TestClient {
  private authSession?: AuthSession;
  private apolloClient: ApolloClient;
  private baseUrl: string;

  constructor(baseUrl: string, authSession?: AuthSession) {
    this.authSession = authSession;
    this.baseUrl = baseUrl;
    this.apolloClient = this.createApolloClient();
  }

  private createApolloClient(): ApolloClient {
    const httpLink = new HttpLink({
      uri: this.baseUrl,
      fetch,
    });

    const authLink = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          ...(this.authSession?.token
            ? { Authorization: `Bearer ${this.authSession.token}` }
            : {}),
        },
      });
      return forward(operation);
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: { fetchPolicy: 'no-cache' },
        query: { fetchPolicy: 'no-cache' },
        mutate: { fetchPolicy: 'no-cache' },
      },
    });
  }

  setAuthSession(authSession?: AuthSession) {
    this.authSession = authSession;
    // Optionally recreate the client if you want to reset cache, etc.
    // this.apolloClient = this.createApolloClient();
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.apolloClient = this.createApolloClient();
  }

  get client() {
    return this.apolloClient;
  }

  get session() {
    return this.authSession;
  }
}
