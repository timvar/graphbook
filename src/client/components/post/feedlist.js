/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Post from './index';

export default class FeedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      hasMore: true,
    };
  }

  loadMore = fetchMore => {
    const self = this;
    const { page } = this.state;
    fetchMore({
      variables: {
        page: page + 1,
      },
      updateQuery(previousResult, { fetchMoreResult }) {
        if (!fetchMoreResult.postsFeed.posts.length) {
          self.setState({ hasMore: false });
          return previousResult;
        }
        self.setState({ page: page + 1 });
        const newData = {
          postsFeed: {
            __typename: 'PostFeed',
            posts: [
              ...previousResult.postsFeed.posts,
              ...fetchMoreResult.postsFeed.posts,
            ],
          },
        };
        return newData;
      },
    });
  };

  render() {
    const { posts, fetchMore } = this.props;
    const { hasMore } = this.state;
    console.log('posts', posts);
    return (
      <div className="feed">
        <InfiniteScroll
          loadMore={() => this.loadMore(fetchMore)}
          hasMore={hasMore}
          loader={
            <div className="loader" key="loader">
              Loading ...
            </div>
          }
        >
          {posts.map((post, i) => (
            <Post key={post.id} post={post} />
          ))}
        </InfiniteScroll>
      </div>
    );
  }
}
