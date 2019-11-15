/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';

export default class ChatsList extends Component {
  usernamesToString(users) {
    const userList = users.slice(1);
    let usernamesString = '';

    for (let i = 0; i < userList.length; i += 1) {
      usernamesString += userList[i].username;
      if (i - 1 === userList.length) {
        usernamesString += ', ';
      }
    }
    console.log('usernamesString', usernamesString);
    return usernamesString;
  }

  shorten(text) {
    console.log('shorten');
    if (!text.length) {
      return '';
    }
    if (text.length > 12) {
      return `${text.substring(0, text.length - 9)}...`;
    }
    return text;
  }

  handleKeyPress() {}

  render() {
    console.log('chatslist');
    const { chats, openChat } = this.props;

    return (
      <div className="chats">
        {chats.map((chat, i) => (
          <div
            key={`chat${chat.id}`}
            className="chat"
            onClick={() => openChat(chat.id)}
            onKeyPress={this.handleKeyPress}
            role="button"
            tabIndex={0}
          >
            <div className="header">
              <img
                alt=""
                src={
                  chat.users.length > 2
                    ? '/public/group.png'
                    : chat.users[1].avatar
                }
              />
              <div>
                <h2>
                  {this.shorten(this.usernamesToString(chat.users))}
                </h2>
                <span>
                  {chat.lastMessage &&
                    this.shorten(chat.lastMessage.text)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
