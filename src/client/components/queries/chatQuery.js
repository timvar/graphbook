import React, { Component } from 'react';
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

export default class UserQuery extends Component {
  getVariables() {
    const { variables } = this.props;
    const queryVariables = {};

    if (typeof variables.chatId !== typeof undefined) {
      queryVariables.chatId = variables.chatId;
    }

    return queryVariables;
  }

  render() {
    const { children } = this.props;
    const variables = this.getVariables();
    return (
      <Query query={GET_CHAT} variables={variables}>
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
}
