import React from 'react';
import PostsQuery from './components/queries/postsFeed';
import AddPostMutation from './components/mutations/addPost';
import FeedList from './components/post/feedlist';
import PostForm from './components/post/form';

export default function Feed({ currentUser }) {
  const queryVariables = { page: 0, limit: 10 };
  console.log('Feed currentUser', currentUser);

  return (
    <div className="container">
      <AddPostMutation variables={queryVariables}>
        <PostForm user={currentUser} />
      </AddPostMutation>
      <PostsQuery variables={queryVariables}>
        <FeedList />
      </PostsQuery>
    </div>
  );
}
