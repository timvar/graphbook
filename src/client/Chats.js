import React, { Component } from 'react';
import ChatWindow from './components/chat/window';
import ChatQuery from './components/queries/chatQuery';
import ChatsQuery from './components/queries/chatsQuery';
import ChatsList from './components/chat/list';

export default class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = { openChats: [], textInputs: {} };
  }

  openChat = id => {
    const { openChats, textInputs } = this.state;
    let newOpenChats = openChats.slice();
    const newTextInputs = { ...textInputs };

    if (newOpenChats.indexOf(id) === -1) {
      if (newOpenChats.length > 2) {
        newOpenChats = newOpenChats.slice(1);
      }
      newOpenChats.push(id);
      newTextInputs[id] = '';
    }

    this.setState({
      openChats: newOpenChats,
      textInputs: newTextInputs,
    });
  };

  closeChat = id => {
    const { openChats, textInputs } = this.state;
    const newOpenChats = openChats.slice();
    const newTextInputs = { ...textInputs };
    const index = newOpenChats.indexOf(id);
    newOpenChats.splice(index, 1);
    delete newTextInputs[id];
    this.setState({
      openChats: newOpenChats,
      textInputs: newTextInputs,
    });
  };

  render() {
    const { openChats } = this.state;
    return (
      <div className="wrapper">
        <ChatsQuery>
          <ChatsList openChat={this.openChat} />
        </ChatsQuery>
        <div className="openChats">
          {openChats.map((chatId, i) => (
            <ChatQuery
              key={`chatWindow${chatId}`}
              variables={{ chatId }}
            >
              <ChatWindow closeChat={this.closeChat} />
            </ChatQuery>
          ))}
        </div>
      </div>
    );
  }
}
