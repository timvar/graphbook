import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

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

const UPDATE_POST = gql`
  mutation updatePost($post: PostInput!, $postId: Int!) {
    updatePost(post: $post, postId: $postId) {
      id
      text
    }
  }
`;

export default class UpdatePostMutation extends Component {
  constructor(props) {
    super(props);
    const { post } = this.props;
    this.state = {
      postContent: post.text,
    };
  }

  changePostContent = value => {
    this.setState({ postContent: value });
  };

  render() {
    const self = this;
    const { children, post } = this.props;
    const { postContent } = this.state;

    const postId = post.id;
    const variables = { page: 0, limit: 10 };

    return (
      <Mutation
        update={(store, { data: { updatePost } }) => {
          const query = {
            query: GET_POSTS,
          };
          if (typeof variables !== typeof undefined) {
            query.variables = variables;
          }
          const data = store.readQuery(query);
          for (let i = 0; i < data.postsFeed.posts.length; i += 1) {
            if (data.postsFeed.posts[i].id === postId) {
              data.postsFeed.posts[i].text = updatePost.text;
              break;
            }
          }
          store.writeQuery({ ...query, data });
        }}
        optimisticResponse={{
          __typename: 'Mutation',
          updatePost: {
            __typename: 'Post',
            text: postContent,
          },
        }}
        mutation={UPDATE_POST}
      >
        {updatePost =>
          React.Children.map(children, function(child) {
            return React.cloneElement(child, {
              updatePost,
              postContent,
              postId,
              changePostContent: self.changePostContent,
            });
          })
        }
      </Mutation>
    );
  }
}
