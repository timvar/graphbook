import React, { Component } from 'react';
import { withApollo } from 'react-apollo';

class Logout extends Component {
  logout = () => {
    const { client } = this.props;
    localStorage.removeItem('jwt');
    client.resetStore();
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
