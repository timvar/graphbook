/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      text: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
    },
    {},
  );
  Post.associate = function(models) {
    Post.belongsTo(models.User);
  };
  return Post;
};
