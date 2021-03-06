/* eslint-disable spaced-comment */
// eslint-disable-next-line strict
//'use strict';

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      text: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      chatId: DataTypes.INTEGER,
    },
    {},
  );
  Message.associate = function(models) {
    Message.belongsTo(models.User);
    Message.belongsTo(models.Chat);
  };
  // associations can be defined here
  return Message;
};
