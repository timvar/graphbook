import React, { Component } from 'react';
import { withApollo } from 'react-apollo';

class Logout extends Component {
  logout = () => {
    const { changeLoginState, client } = this.props;
    const { resetStore } = client;

    localStorage.removeItem('jwt');
    changeLoginState(false);
    resetStore();
  };

  render() {
    return (
      <button type="button" className="logout" onClick={this.logout}>
        Logout
      </button>
    );
  }
}

export default withApollo(Logout);
