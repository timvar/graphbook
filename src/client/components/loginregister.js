import React, { Component } from 'react';
import LoginMutation from './mutations/login';
import RegisterMutation from './mutations/signup';
import RegisterForm from './registerform';
import LoginForm from './loginform';

export default class LoginRegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: true,
    };
  }

  render() {
    const { changeLoginState } = this.props;
    const { showLogin } = this.state;
    return (
      <div className="authModal">
        {showLogin && (
          <div>
            <LoginMutation changeLoginState={changeLoginState}>
              <LoginForm />
            </LoginMutation>
            Want to sign up?
            <button
              type="button"
              onClick={() => this.setState({ showLogin: false })}
            >
              Click here
            </button>
          </div>
        )}
        {!showLogin && (
          <div>
            <RegisterMutation changeLoginState={changeLoginState}>
              <RegisterForm />
            </RegisterMutation>
            Want to login?
            <button
              type="button"
              onClick={() => this.setState({ showLogin: true })}
            >
              Click here
            </button>
          </div>
        )}
      </div>
    );
  }
}
