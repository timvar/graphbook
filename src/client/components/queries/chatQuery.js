import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../loading';
import Error from '../error';

const GET_CHAT = gql`
  query chat($chatId: Int!) {
    chat(chatId: $chatId) {
      id
      users {
        id
        avatar
        username
      }
      messages {
        id
        text
        user {
          id
        }
      }
    }
  }
`;

const getChatVariables = variables => {
  const chatVariables = {};

  if (typeof variables.chatId !== typeof undefined) {
    chatVariables.chatId = variables.chatId;
  }

  return chatVariables;
};

export default function ChatQuery({ children, variables }) {
  const chatVariables = getChatVariables(variables);

  return (
    <Query query={GET_CHAT} variables={chatVariables}>
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error)
          return (
            <Error>
              <p>{error.message}</p>
            </Error>
          );

        const { chat } = data;
        return React.Children.map(children, child => {
          return React.cloneElement(child, { chat });
        });
      }}
    </Query>
  );
}
