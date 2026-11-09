import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';

// Detección dinámica inteligente: si corre en la nube (Azure/AWS), usa el mismo host en puerto 8003
const getGraphQLUri = (): string => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Si corre en la nube (Render, DuckDNS de Nataly o cualquier dominio de producción)
    if (host.includes('onrender.com') || host.includes('duckdns.org') || host.includes('vercel.app')) {
      return 'https://ms3-inventario-backend.onrender.com/graphql';
    }
  }
  return import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://127.0.0.1:8003/graphql';
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
