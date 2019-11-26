import React from 'react';
import UserProfile from './components/user';
import Chats from './Chats';
import Bar from './components/bar';
import CurrentUserQuery from './components/queries/currentUser';

export default function User({ changeLoginState, ...props }) {
  const { match } = props;
  return (
    <CurrentUserQuery>
      <Bar changeLoginState={changeLoginState} />
      <UserProfile username={match.params.username} />
      <Chats />
    </CurrentUserQuery>
  );
}
