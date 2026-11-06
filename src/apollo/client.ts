import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';

const uri = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://127.0.0.1:8003/graphql';

const httpLink = createHttpLink({
  uri,
  fetchOptions: {
    mode: 'cors',
  },
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});
