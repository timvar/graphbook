/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import Error from './error';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  formlogin = event => {
    const { login } = this.props;
    const { email, password } = this.state;

    event.preventDefault();
    login({
      variables: {
        email,
        password,
      },
    });
  };

  render() {
    const { error } = this.props;
    return (
      <div className="login">
        <form onSubmit={this.formlogin}>
          <label htmlFor="email">
            Email
            <input
              type="text"
              onChange={event =>
                this.setState({ email: event.target.value })
              }
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              onChange={event =>
                this.setState({ password: event.target.value })
              }
            />
            <br />
            <input type="submit" value="Login" />
          </label>
        </form>
        {error && (
          <Error>
            <p>There was an error logging in!</p>
          </Error>
        )}
      </div>
    );
  }
}
