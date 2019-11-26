import React, { Component } from 'react';
import { withApollo } from 'react-apollo';

class Logout extends Component {
  doLogout = () => {
    const { logout, client } = this.props;
    logout().then(() => {
      localStorage.removeItem('jwt');
      client.resetStore();
    });
  };

  render() {
    return (
      <button
        type="button"
        className="logout"
        onClick={this.doLogout}
      >
        Logout
      </button>
    );
  }
}

export default withApollo(Logout);
