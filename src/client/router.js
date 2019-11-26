import React from 'react';
import NotFound from './components/router/notFound';
import LoginRegisterForm from './components/loginregister';
import Main from './Main';
import PrivateRoute from './components/router/privateRoute';
import LoginRoute from './components/router/loginRoute';
import User from './User';

const ReactRouter = require('react-router-dom');

let Router;
if (typeof window !== typeof undefined) {
  const { BrowserRouter } = ReactRouter;
  Router = BrowserRouter;
} else {
  const { StaticRouter } = ReactRouter;
  Router = StaticRouter;
}
const { Route, Switch } = ReactRouter;

export default function Routing({
  changeLoginState,
  loggedIn,
  context,
  location,
}) {
  return (
    <Router context={context} location={location}>
      <Switch>
        <LoginRoute
          exact
          path="/"
          component={() => (
            <LoginRegisterForm changeLoginState={changeLoginState} />
          )}
          loggedIn={loggedIn}
        />

        <PrivateRoute
          path="/app"
          component={() => (
            <Main changeLoginState={changeLoginState} />
          )}
          loggedIn={loggedIn}
        />

        <PrivateRoute
          path="/user/:username"
          component={props => (
            <User {...props} changeLoginState={changeLoginState} />
          )}
          loggedIn={loggedIn}
        />

        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
