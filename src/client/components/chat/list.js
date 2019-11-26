/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

const MESSAGES_SUBSCRIPTION = gql`
  subscription onMessageAdded {
    messageAdded {
      id
      text
      chat {
        id
      }
      user {
        id
        __typename
      }
      __typename
    }
  }
`;

const GET_CHAT = gql`
  query chat($chatId: Int!) {
    chat(chatId: $chatId) {
      id
      users {
        id
        avatar
        username
      }
      messages {
        id
        text
        user {
          id
        }
      }
    }
  }
`;

class ChatsList extends Component {
  componentDidMount() {
    this.subscribeToNewMessages();
  }

  subscribeToNewMessages = () => {
    const self = this;
    const { user, subscribeToMore } = this.props;
    subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        const newList = { chats: [...prev.chats] };
        if (!subscriptionData.data || !prev.chats.length) return prev;

        let index = -1;
        for (let i = 0; i < prev.chats.length; i += 1) {
          if (
            prev.chats[i].id ===
            subscriptionData.data.messageAdded.chat.id
          ) {
            index = i;
            const newValue = {
              ...prev.chats[i],
              lastMessage: {
                text: subscriptionData.data.messageAdded.text,
                __typename:
                  subscriptionData.data.messageAdded.__typename,
              },
            };
            newList.chats[i] = newValue;
            try {
              const data = self.props.client.store.cache.readQuery({
                query: GET_CHAT,
                variables: {
                  chatId: subscriptionData.data.messageAdded.chat.id,
                },
              });
              if (
                user.id !== subscriptionData.data.messageAdded.user.id
              ) {
                data.chat.messages.push(
                  subscriptionData.data.messageAdded,
                );
                self.props.client.store.cache.writeQuery({
                  query: GET_CHAT,
                  variables: {
                    chatId:
                      subscriptionData.data.messageAdded.chat.id,
                  },
                  data,
                });
              }
            } catch (e) {
              console.log(e);
            }
            break;
          }
        }

        if (index === -1) return prev;

        return newList;
      },
    });
  };

  usernamesToString = userList => {
    const { user } = this.props;
    let usernamesString = '';
    for (let i = 0; i < userList.length; i += 1) {
      if (userList[i].username !== user.username) {
        usernamesString += userList[i].username;
      }
      if (i - 1 === userList.length) {
        usernamesString += ', ';
      }
    }
    return usernamesString;
  };

  getAvatar = userList => {
    const { user } = this.props;
    if (userList.length > 2) {
      return '/public/group.png';
    }
    if (userList[0].id !== user.id) {
      return userList[0].avatar;
    }
    return userList[1].avatar;
  };

  shorten = text => {
    if (!text.length) {
      return '';
    }
    if (text.length > 12) {
      return `${text.substring(0, text.length - 9)}...`;
    }
    return text;
  };

  handleKeyPress = () => {};

  render() {
    const { chats, openChat } = this.props;
    return (
      <div className="chats">
        {chats.map((chat, i) => (
          <div
            key={`chat${chat.id}`}
            className="chat"
            onKeyPress={() => this.handleKeyPress()}
            onClick={() => openChat(chat.id)}
            role="button"
            tabIndex={0}
          >
            <div className="header">
              <img alt="" src={this.getAvatar(chat.users)} />
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

export default withApollo(ChatsList);
