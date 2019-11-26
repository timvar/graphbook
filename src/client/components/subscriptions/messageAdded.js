import React from 'react';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';

const MESSAGES_SUBSCRIPTION = gql`
  subscription onMessageAdded {
    messageAdded {
      id
      text
      chat {
        id
      }
      user {
        id
        __typename
      }
      __typename
    }
  }
`;
export default function MessageAddedSubscription({ children }) {
  return (
    <Subscription subscription={MESSAGES_SUBSCRIPTION}>
      {({ data }) => {
        return React.Children.map(children, child => {
          return React.cloneElement(child, { data });
        });
      }}
    </Subscription>
  );
}
