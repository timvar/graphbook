import React, { Component } from 'react';

export default class SearchList extends Component {
  constructor(props) {
    super(props);
    const { users } = this.props;
    this.state = {
      showList: this.checkLength(users),
    };
  }

  componentWillReceiveProps(props) {
    this.showList(props.users);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeList);
  }

  closeList = () => {
    this.setState({ showList: false });
  };

  checkLength(users) {
    if (users.length > 0) {
      document.addEventListener('click', this.closeList);
      return true;
    }
    return false;
  }

  showList(users) {
    if (this.checkLength(users)) {
      this.setState({ showList: true });
    } else {
      this.closeList();
    }
  }

  render() {
    const { users } = this.props;
    const { showList } = this.state;
    return (
      showList && (
        <div className="result">
          {users.map((user, i) => (
            <div key={user.id} className="user">
              <img alt="" src={user.avatar} />
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      )
    );
  }
}
