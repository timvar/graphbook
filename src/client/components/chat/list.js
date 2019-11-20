/* eslint-disable class-methods-use-this */
import React from 'react';

const usernamesToString = users => {
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

const shorten = text => {
  if (!text.length) {
    return '';
  }
  if (text.length > 12) {
    return `${text.substring(0, text.length - 9)}...`;
  }

  return text;
};

const handleKeyPress = () => {};

export default function ChatsList({ chats, openChat }) {
  return (
    <div className="chats">
      {chats.map((chat, i) => (
        <div
          key={`chat${chat.id}`}
          className="chat"
          onClick={() => openChat(chat.id)}
          onKeyPress={() => handleKeyPress()}
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
              <h2>{shorten(usernamesToString(chat.users))}</h2>
              <span>
                {chat.lastMessage && shorten(chat.lastMessage.text)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
