import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../loading';
import Error from '../error';

const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      email
      username
      avatar
    }
  }
`;

const getUsername = variables => {
  const queryVariables = {};
  if (typeof variables.username !== typeof undefined) {
    queryVariables.username = variables.username;
  }
  return queryVariables;
};

export default function UserQuery({ children, variables }) {
  const queryVariables = getUsername(variables);
  return (
    <Query query={GET_USER} variables={queryVariables}>
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error)
          return (
            <Error>
              <p>{error.message}</p>
            </Error>
          );
        const { user } = data;
        console.log('userquery user', user);
        return React.Children.map(children, child => {
          return React.cloneElement(child, { user });
        });
      }}
    </Query>
  );
}
