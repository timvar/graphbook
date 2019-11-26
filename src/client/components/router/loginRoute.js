import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const LoginRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.loggedIn === false ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname:
              typeof props.location.state !== typeof undefined
                ? props.location.state.from.pathname
                : '/app',
          }}
        />
      )
    }
  />
);

export { LoginRoute as default };
