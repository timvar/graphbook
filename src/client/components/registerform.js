/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import Error from './error';

export default class RegisterForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      username: '',
    };
  }

  login = event => {
    const { signup } = this.props;
    const { email, password, username } = this.state;

    event.preventDefault();
    signup({
      variables: {
        email,
        password,
        username,
      },
    });
  };

  render() {
    const { error } = this.props;
    return (
      <div className="login">
        <form onSubmit={this.login}>
          <label htmlFor="email">
            Email
            <input
              type="text"
              onChange={event =>
                this.setState({ email: event.target.value })
              }
            />
          </label>
          <label htmlFor="username">
            Username
            <input
              type="text"
              onChange={event =>
                this.setState({ username: event.target.value })
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
          </label>
          <input type="submit" value="Sign up" />
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
