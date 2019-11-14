import React, { Component } from 'react';
import ChatWindow from './components/chat/window';
import ChatQuery from './components/queries/chatQuery';
import ChatsQuery from './components/queries/chatsQuery';
import ChatsList from './components/chat/list';

export default class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openChats: [],
    };
  }

  openChat = id => {
    const { openChats } = this.state;
    let newOpenChats = openChats.slice();

    if (newOpenChats.indexOf(id) === -1) {
      if (newOpenChats.length > 2) {
        newOpenChats = newOpenChats.slice(1);
      }
      newOpenChats.push(id);
    }

    this.setState({ openChats: newOpenChats });
  };

  closeChat = id => {
    const { openChats } = this.state;
    const newOpenChats = openChats.slice();

    const index = newOpenChats.indexOf(id);
    newOpenChats.splice(index, 1);

    this.setState({ openChats: newOpenChats });
  };

  render() {
    const { user } = this.props;
    const { openChats } = this.state;

    return (
      <div className="wrapper">
        <ChatsQuery>
          <ChatsList openChat={this.openChat} user={user} />
        </ChatsQuery>
        <div className="openChats">
          {openChats.map((chatId, i) => (
            <ChatQuery
              key={`chatWindow${chatId}`}
              variables={{ chatId }}
            >
              <ChatWindow closeChat={this.closeChat} user={user} />
            </ChatQuery>
          ))}
        </div>
      </div>
    );
  }
}
