import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';

// Detección dinámica inteligente: si corre en la nube (Azure/AWS), usa el mismo host en puerto 8003
const getGraphQLUri = (): string => {
  if (import.meta.env.VITE_GRAPHQL_ENDPOINT) {
    return import.meta.env.VITE_GRAPHQL_ENDPOINT;
  }
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost') {
    return `${window.location.protocol}//${window.location.hostname}:8003/graphql`;
  }
  return 'http://127.0.0.1:8003/graphql';
};

const uri = getGraphQLUri();

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
