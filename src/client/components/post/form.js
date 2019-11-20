import React, { Component } from 'react';

export default class PostForm extends Component {
  handlePostContentChange = event => {
    const { changePostContent } = this.props;
    changePostContent(event.target.value);
  };

  handeFormSubmit = e => {
    const {
      addPost,
      updatePost,
      postContent,
      postId,
      changePostContent,
      changeState,
    } = this.props;
    e.preventDefault();
    if (typeof updatePost !== typeof undefined) {
      updatePost({
        variables: { post: { text: postContent }, postId },
      }).then(() => {
        changeState();
      });
    } else {
      addPost({
        variables: {
          post: {
            text: postContent,
          },
        },
      }).then(() => {
        changePostContent('');
      });
    }
  };

  render() {
    const self = this;
    const { postContent } = this.props;

    return (
      <div className="postForm">
        <form onSubmit={e => this.handeFormSubmit(e)}>
          <textarea
            value={postContent}
            onChange={self.handlePostContentChange}
            placeholder="Write your custom post!"
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
