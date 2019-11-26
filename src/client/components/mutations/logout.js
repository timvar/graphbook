import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const LOGOUT = gql`
  mutation logout {
    logout {
      success
    }
  }
`;

export default function LogoutMutation({ children }) {
  return (
    <Mutation mutation={LOGOUT}>
      {(logout, { loading, error }) =>
        React.Children.map(children, child => {
          return React.cloneElement(child, {
            logout,
            loading,
            error,
          });
        })
      }
    </Mutation>
  );
}
