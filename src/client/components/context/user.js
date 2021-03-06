import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      id
      username
      avatar
    }
  }
`;

export default function UserConsumer({ children }) {
  return (
    <ApolloConsumer>
      {client => {
        const { currentUser } = client.readQuery({
          query: GET_CURRENT_USER,
        });
        return React.Children.map(children, child => {
          return React.cloneElement(child, { user: currentUser });
        });
      }}
    </ApolloConsumer>
  );
}
