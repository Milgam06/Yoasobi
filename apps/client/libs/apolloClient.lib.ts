import { ApolloClient, ApolloLink, InMemoryCache, HttpLink, Observable } from '@apollo/client';
import { Platform } from 'react-native';
import { supabaseAuth } from './supabase.lib';

const getGraphQLUrl = () => {
  if (process.env.EXPO_PUBLIC_GRAPHQL_URL) {
    return process.env.EXPO_PUBLIC_GRAPHQL_URL;
  }
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:8686/graphql`;
};

const GRAPHQL_URL = getGraphQLUrl();

const pendingRequests = new Set<() => void>();

const authLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      const requestState: {
        subscription?: { unsubscribe: () => void };
      } = {};

      const cancel = () => {
        observer.error(new Error('Signed out'));
      };

      pendingRequests.add(cancel);

      const executeAuthenticatedRequest = async () => {
        try {
          const { data, error } = await supabaseAuth.getSession();
          if (observer.closed) return;
          if (error) throw error;

          const headers = { ...operation.getContext().headers };
          delete headers.authorization;
          delete headers.Authorization;
          if (data.session?.access_token) {
            headers.authorization = `Bearer ${data.session.access_token}`;
          }
          operation.setContext({ headers });
          requestState.subscription = forward(operation).subscribe(observer);
        } catch (error) {
          if (!observer.closed) observer.error(error);
        }
      };

      executeAuthenticatedRequest();

      return () => {
        pendingRequests.delete(cancel);
        requestState.subscription?.unsubscribe();
      };
    }),
);

export const apolloClient = new ApolloClient({
  link: authLink.concat(
    new HttpLink({
      uri: GRAPHQL_URL,
    }),
  ),
  cache: new InMemoryCache(),
});

supabaseAuth.onAuthStateChange((event) => {
  if (event !== 'SIGNED_OUT') {
    return;
  }
  pendingRequests.forEach((cancel) => cancel());
  apolloClient.clearStore().catch(() => {
    console.error('Failed to clear Apollo cache');
  });
});
