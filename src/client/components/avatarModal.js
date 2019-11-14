import React, { Component } from 'react';
import Modal from 'react-modal';
import DropNCrop from '@synapsestudios/react-drop-n-crop';

Modal.setAppElement('#root');

const modalStyle = {
  content: {
    width: '400px',
    height: '450px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];
  const ia = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }

  const file = new Blob([ia], { type: mimeString });
  return file;
}

export default class AvatarUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      filename: null,
      filetype: null,
      src: null,
      error: null,
    };
  }

  onChange = value => {
    this.setState(value);
  };

  upload = () => {
    const { result, filename } = this.state;
    const { uploadAvatar, showModal } = this.props;
    const file = dataURItoBlob(result);
    file.name = filename;
    uploadAvatar({ variables: { file } }).then(() => {
      showModal();
    });
  };

  changeImage = () => {
    this.setState({ src: null });
  };

  render() {
    const { isOpen, showModal } = this.props;
    const { src } = this.state;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={showModal}
        contentLabel="Change avatar"
        style={modalStyle}
      >
        <DropNCrop onChange={this.onChange} value={this.state} />
        {src !== null && (
          <button
            type="button"
            className="cancelUpload"
            onClick={this.changeImage}
          >
            Change image
          </button>
        )}
        <button
          type="button"
          className="uploadAvatar"
          onClick={this.upload}
        >
          Save
        </button>
      </Modal>
    );
  }
}
