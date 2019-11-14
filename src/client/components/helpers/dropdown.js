import React, { Component } from 'react';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true);
  }

  handleClick = () => {
    const { show } = this.state;

    this.setState({ show: !show }, () => {
      if (!show) {
        document.addEventListener('click', this.handleClick);
      } else {
        document.removeEventListener('click', this.handleClick);
      }
    });
  };

  render() {
    const { trigger, children } = this.props;
    const { show } = this.state;

    return (
      <div className="dropdown">
        <div>
          <div
            role="button"
            className="trigger"
            onClick={this.handleClick}
            onKeyPress={this.handleKeyPress}
            tabIndex={0}
          >
            {trigger}
          </div>
          {show && <div className="content">{children}</div>}
        </div>
      </div>
    );
  }
}
