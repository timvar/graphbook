import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { withApollo } from 'react-apollo';
import Router from './router';

import '../assets/css/style.css';
import './components/fontawesome';
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = props.client.onResetStore(() =>
      this.changeLoginState(false),
    );
    this.state = {
      loggedIn: false,
    };
  }

  componentWillMount() {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.setState({ loggedIn: true });
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  changeLoginState = loggedIn => {
    this.setState({ loggedIn });
  };

  render() {
    const { loggedIn } = this.state;
    return (
      <div>
        <Helmet>
          <title>Graphbook - Feed</title>
          <meta
            name="description"
            content="Newsfeed of all your friends   
           on Graphbook"
          />
        </Helmet>
        <Router
          loggedIn={loggedIn}
          changeLoginState={this.changeLoginState}
        />
      </div>
    );
  }
}

export default withApollo(App);

/*
render() {
    const { loggedIn } = this.state;
    return (
      <div className="container">
        <Helmet>
          <title>Graphbook - Feed</title>
          <meta
            name="description"
            content="Newsfeed of all your friends on Graphbook"
          />
        </Helmet>
        {loggedIn ? (
          <CurrentUserQuery>
            <Bar changeLoginState={this.changeLoginState} />
            <Feed />
            <Chats />
          </CurrentUserQuery>
        ) : (
          <LoginRegisterForm
            changeLoginState={this.changeLoginState}
          />
        )}
      </div>
    );
  }


*/
