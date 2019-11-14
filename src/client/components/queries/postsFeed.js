import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../loading';
import Error from '../error';

const GET_POSTS = gql`
  query postsFeed($page: Int, $limit: Int) {
    postsFeed(page: $page, limit: $limit) {
      posts {
        id
        text
        user {
          avatar
          username
        }
      }
    }
  }
`;

export default class PostsFeedQuery extends Component {
  getVariables() {
    const { variables } = this.props;
    const queryVariables = {
      page: 0,
      limit: 10,
    };

    if (typeof variables !== typeof undefined) {
      if (typeof variables.page !== typeof undefined) {
        queryVariables.page = variables.page;
      }
      if (typeof variables.limit !== typeof undefined) {
        queryVariables.limit = variables.limit;
      }
    }

    return queryVariables;
  }

  render() {
    const { children } = this.props;
    const variables = this.getVariables();
    console.log('postFeed variables.limit', variables.limit);

    return (
      <Query query={GET_POSTS} variables={variables}>
        {({ loading, error, data, fetchMore }) => {
          if (loading) return <Loading />;
          if (error)
            return (
              <Error>
                <p>{error.message}</p>
              </Error>
            );

          const { postsFeed } = data;
          const { posts } = postsFeed;

          return React.Children.map(children, child => {
            return React.cloneElement(child, { posts, fetchMore });
          });
        }}
      </Query>
    );
  }
}
