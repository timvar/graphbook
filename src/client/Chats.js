import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_CHATS = gql`
  {
    chats {
      id
      users {
        id
        avatar
        username
      }
      lastMessage {
        text
      }
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

const ADD_MESSAGE = gql`
  mutation addMessage($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
      user {
        id
      }
    }
  }
`;

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

  onChangeChatInput = (event, id) => {
    const { textInputs } = this.state;
    event.preventDefault();
    const newTextInputs = { ...textInputs };
    newTextInputs[id] = event.target.value;
    this.setState({ textInputs: newTextInputs });
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

  shorten = text => {
    if (text.length > 12) {
      return `${text.substring(0, text.length - 9)}...`;
    }

    return text;
  };

  handleKeyPress = (event, id, addMessage) => {
    const self = this;
    const { textInputs } = this.state;
    const newTextInputs = { ...textInputs };

    if (event.key === 'Enter' && newTextInputs[id].length) {
      addMessage({
        variables: {
          message: { text: newTextInputs[id], chatId: id },
        },
      }).then(() => {
        newTextInputs[id] = '';
        self.setState({ textInputs: newTextInputs });
      });
    }
  };

  dummyHandleKeyPress = () => {};

  usernamesToString = users => {
    const userList = users.slice(1);
    let usernamesString = '';
    for (let i = 0; i < userList.length; i += 1) {
      usernamesString += userList[i].username;
      if (i - 1 === userList.length) {
        usernamesString += ', ';
      }
    }
    return usernamesString;
  };

  render() {
    const { openChats, textInputs } = this.state;
    const self = this;
    return (
      <div className="wrapper">
        <div className="chats">
          <Query query={GET_CHATS}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return error.message;

              const { chats } = data;

              return chats.map((chat, i) => (
                <div
                  key={`chat${chat.id}`}
                  onClick={() => self.openChat(chat.id)}
                  onKeyPress={() => this.dummyHandleKeyPress()}
                  className="chat"
                  role="button"
                  tabIndex={0}
                >
                  <div className="header">
                    <img
                      alt=""
                      src={
                        chat.users.length > 2
                          ? '/public/group.png'
                          : '/uploads/avatar2.png'
                      }
                    />
                    <div>
                      <h2>
                        {this.shorten(
                          this.usernamesToString(chat.users),
                        )}
                      </h2>
                      <span>
                        {chat.lastMessage &&
                          this.shorten(chat.lastMessage.text)}
                      </span>
                    </div>
                  </div>
                </div>
              ));
            }}
          </Query>
        </div>
        <div className="openChats">
          {openChats.map((chatId, i) => (
            <Query
              key={`chatWindow${chatId}`}
              query={GET_CHAT}
              variables={{ chatId }}
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return error.message;

                const { chat } = data;

                return (
                  <div className="chatWindow">
                    <div className="header">
                      <span>{chat.users[1].username}</span>
                      <button
                        type="button"
                        className="close"
                        onClick={() => this.closeChat(chatId)}
                      >
                        X
                      </button>
                    </div>
                    <div className="messages">
                      {chat.messages.map((message, j) => (
                        <div
                          key={`message${message.id}`}
                          className={`message ${
                            message.user.id > 5 ? 'left' : 'right'
                          }`}
                        >
                          {message.text}
                        </div>
                      ))}
                    </div>
                    <Mutation
                      update={(store, { data: { addMessage } }) => {
                        const queryData = store.readQuery({
                          query: GET_CHAT,
                          variables: { chatId: chat.id },
                        });
                        queryData.chat.messages.push(addMessage);
                        store.writeQuery({
                          query: GET_CHAT,
                          variables: { chatId: chat.id },
                          data: queryData,
                        });
                      }}
                      mutation={ADD_MESSAGE}
                    >
                      {addMessage => (
                        <div className="input">
                          <input
                            type="text"
                            value={textInputs[chat.id]}
                            onChange={event =>
                              self.onChangeChatInput(event, chat.id)
                            }
                            onKeyPress={event => {
                              self.handleKeyPress(
                                event,
                                chat.id,
                                addMessage,
                              );
                            }}
                          />
                        </div>
                      )}
                    </Mutation>
                  </div>
                );
              }}
            </Query>
          ))}
        </div>
      </div>
    );
  }
}
