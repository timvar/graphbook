import React, { Component } from 'react';
import UploadAvatarMutation from '../mutations/uploadAvatar';
import AvatarUpload from '../avatarModal';

export default class UserBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  showModal = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  render() {
    const { user } = this.props;
    const { isOpen } = this.state;
    if (!user) return null;

    return (
      <div className="user">
        <img
          alt=""
          src={user.avatar}
          onClick={this.showModal}
          onKeyPress={this.showModal}
        />
        <UploadAvatarMutation>
          <AvatarUpload isOpen={isOpen} showModal={this.showModal} />
        </UploadAvatarMutation>
        <span>{user.username}</span>
      </div>
    );
  }
}
