/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable spaced-comment */
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink, createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
// import { createUploadLink } from 'apollo-upload-client';

// const link = new HttpLink({ uri: 'http://localhost:8000/graphql' });
// const uploadLink = () => createUploadLink({
//   uri: 'http://localhost:8000/graphql',
//   credentials: 'same-origin',
// });
const cache = new InMemoryCache();
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});
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

/*
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log('graphQLError -errorLink');
    graphQLErrors.map(({ message, locations, path, extensions }) => {
      if (extensions.code === 'UNAUTHENTICATED') {
        localStorage.removeItem('jwt');
        client.resetStore();
      }
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  }
});
*/

/*
const link = ApolloLink.from([
  loggerLink,
  AuthLink,
  errorLink,
  httpLink(),
]);
*/

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
    httpLink,
  ]),
});

export default client;

/*
onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        console.log('graphQLError -errorLink');
        graphQLErrors.map(
          ({ message, locations, path, extensions }) => {
            if (extensions.code === 'UNAUTHENTICATED') {
              localStorage.removeItem('jwt');
              client.resetStore();
            }
            console.log(
              `[GraphQL error - indeed]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            );
          },
        );
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }
    }),
*/
