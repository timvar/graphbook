import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../loading';
import Error from '../error';

const GET_CHATS = gql`
  query chats {
    chats {
      id
      users {
        id
        avatar
        username
      }
      lastMessage {
        text
      }
    }
  }
`;

export default function ChatsQuery({ children }) {
  return (
    <Query query={GET_CHATS}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <Loading />;
        if (error)
          return (
            <Error>
              <p>{error.message}</p>
            </Error>
          );

        const { chats } = data;
        return React.Children.map(children, child => {
          return React.cloneElement(child, {
            chats,
            subscribeToMore,
          });
        });
      }}
    </Query>
  );
}
