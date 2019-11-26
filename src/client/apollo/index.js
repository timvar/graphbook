/* eslint-disable no-restricted-globals */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable spaced-comment */
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
//import { HttpLink, createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';

const protocol = location.protocol !== 'https:' ? 'ws://' : 'wss://';
const port = location.port ? `:${location.port}` : '';

const httpLink = createUploadLink({
  uri: `${location.protocol}//${location.hostname}${port}/graphql`,
  credentials: 'same-origin',
});

// const link = new HttpLink({ uri: 'http://localhost:8000/graphql' });
// const uploadLink = createUploadLink({
//   uri: 'http://localhost:8000/graphql',
//   credentials: 'same-origin',
// });

const SUBSCRIPTIONS_ENDPOINT = `${protocol +
  location.hostname +
  port}/subscriptions`;
const subClient = new SubscriptionClient(SUBSCRIPTIONS_ENDPOINT, {
  reconnect: true,
  connectionParams: () => {
    const token = localStorage.getItem('jwt');
    if (token) {
      return { authToken: token };
    }
    return {};
  },
});
const wsLink = new WebSocketLink(subClient);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' && operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache();
//const httpLink = createHttpLink({
//  uri: 'http://localhost:8000/graphql',
//});
const loggerLink = new ApolloLink((operation, forward) => {
  console.log(`GraphQL Request: ${operation.operationName}`);
  operation.setContext({ start: new Date() });
  return forward(operation).map(response => {
    const responseTime = new Date() - operation.getContext().start;
    console.log(`GraphQL Response took: ${responseTime}`);
    return response;
  });
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    operation.setContext(context => ({
      ...context,
      headers: {
        ...context.headers,
        Authorization: `Bearer ${token}`,
      },
    }));
  }
  return forward(operation);
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    loggerLink,
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(
          ({ message, locations, path, extensions }) => {
            if (extensions.code === 'UNAUTHENTICATED') {
              localStorage.removeItem('jwt');
              client.resetStore();
            }
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            );
          },
        );
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }
    }),
    authLink,
    link,
  ]),
});

export default client;
