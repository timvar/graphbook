import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from '../helpers/dropdown';
import DeletePostMutation from '../mutations/deletePost';

const DeleteButton = ({ deletePost, postId }) => (
  <button
    type="button"
    onClick={() => {
      deletePost({ variables: { postId } });
    }}
  >
    Delete
  </button>
);

export default ({ post, changeState }) => (
  <div className="header">
    <img alt="" src={post.user.avatar} />
    <div>
      <h2>{post.user.username}</h2>
    </div>
    <Dropdown trigger={<FontAwesomeIcon icon="angle-down" />}>
      <button type="button" onClick={changeState}>
        Edit
      </button>
      <DeletePostMutation post={post}>
        <DeleteButton />
      </DeletePostMutation>
    </Dropdown>
  </div>
);
