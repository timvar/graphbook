import React from 'react';

export default function UserProfileHeader({ user }) {
  console.log('userprofileheader user', user);
  return (
    <div className="profileHeader">
      <div className="avatar">
        <img alt="" src={user.avatar} />
      </div>
      <div className="information">
        <p>{user.username}</p>
        <p>{user.email}</p>
        <p>
          You can provide further information here and build your
          really personal header component for your users.
        </p>
      </div>
    </div>
  );
}
