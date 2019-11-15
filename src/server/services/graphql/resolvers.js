import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import aws from 'aws-sdk';
import logger from '../../helpers/logger';

const s3 = new aws.S3({
  signatureVersion: 'v4',
  region: 'eu-west-1',
});

const dotenv = require('dotenv');

dotenv.config();

const { Op } = Sequelize;
const { JWT_SECRET } = process.env;

export default function resolver() {
  const { db } = this;
  const { Post, User, Chat, Message } = db.models;

  const resolvers = {
    Post: {
      user(post, args, context) {
        return post.getUser();
      },
    },
    Message: {
      user(message, args, context) {
        return message.getUser();
      },
      chat(message, args, context) {
        return message.getChat();
      },
    },
    Chat: {
      messages(chat, args, context) {
        return chat.getMessages({ order: [['id', 'ASC']] });
      },
      users(chat, args, context) {
        return chat.getUsers();
      },
      lastMessage(chat, args, context) {
        return chat
          .getMessages({ limit: 1, order: [['id', 'DESC']] })
          .then(message => {
            return message[0];
          });
      },
    },
    RootQuery: {
      currentUser(root, args, context) {
        return context.user;
      },
      posts(root, args, context) {
        return Post.findAll({ order: [['createdAt', 'DESC']] });
      },
      user(root, { userId }, context) {
        return User.findById(userId);
      },
      chat(root, { chatId }, context) {
        return Chat.findById(chatId, {
          include: [
            {
              model: User,
              required: true,
            },
            {
              model: Message,
            },
          ],
        });
      },
      chats(root, args, context) {
        return Chat.findAll({
          include: [
            {
              model: User,
              required: true,
              through: { where: { userId: context.user.id } },
            },
            {
              model: Message,
            },
          ],
        });
      },
      postsFeed(root, { page, limit }, context) {
        let skip = 0;

        if (page && limit) {
          skip = page * limit;
        }

        const query = {
          order: [['createdAt', 'DESC']],
          offset: skip,
        };

        if (limit) {
          query.limit = limit;
        }

        return {
          posts: Post.findAll(query),
        };
      },
      usersSearch(root, { page, limit, text }, context) {
        if (text.length < 3) {
          return {
            users: [],
          };
        }
        let skip = 0;
        if (page && limit) {
          skip = page * limit;
        }
        const query = {
          order: [['createdAt', 'DESC']],
          offset: skip,
        };
        if (limit) {
          query.limit = limit;
        }
        query.where = {
          username: {
            [Op.like]: `%${text}%`,
          },
        };
        return {
          users: User.findAll(query),
        };
      },
    },
    RootMutation: {
      addPost(root, { post }, context) {
        logger.log({
          level: 'info',
          message: 'Post was created',
        });

        return User.findAll().then(users => {
          return Post.create({
            ...post,
          }).then(newPost => {
            return Promise.all([
              newPost.setUser(context.user.dataValues.id),
            ]).then(() => {
              return newPost;
            });
          });
        });
      },
      addChat(root, { chat }, context) {
        logger.log({
          level: 'info',
          message: 'Message was created',
        });
        return Chat.create().then(newChat => {
          return Promise.all([newChat.setUsers(chat.users)]).then(
            () => {
              return newChat;
            },
          );
        });
      },
      addMessage(root, { message }, context) {
        logger.log({
          level: 'info',
          message: 'Message was created',
        });
        return Message.create({
          ...message,
        }).then(newMessage => {
          return Promise.all([
            newMessage.setUser(context.user.id),
            newMessage.setChat(message.chatId),
          ]).then(() => {
            pubsub.publish('messageAdded', {
              messageAdded: newMessage,
            });
            return newMessage;
          });
        });
      },
      updatePost(root, { post, postId }, context) {
        return Post.update(
          {
            ...post,
          },
          {
            where: {
              id: postId,
            },
          },
        ).then(rows => {
          if (rows[0] === 1) {
            logger.log({
              level: 'info',
              message: `Post ${postId} was updated`,
            });

            return Post.findById(postId);
          }
          throw new Error('Post was not updated.');
        });
      },
      deletePost(root, { postId }, context) {
        return Post.destroy({
          where: {
            id: postId,
          },
        }).then(
          rows => {
            if (rows === 1) {
              logger.log({
                level: 'info',
                message: `Post ${postId} was deleted`,
              });
              return {
                success: true,
              };
            }
            return {
              success: false,
            };
          },
          err => {
            logger.log({
              level: 'error',
              message: err.message,
            });
          },
        );
      },
      login(root, { email, password }, context) {
        return User.findAll({
          where: {
            email,
          },
          raw: true,
        }).then(async users => {
          if (users.length === 1) {
            const user = users[0];
            const passwordValid = await bcrypt.compare(
              password,
              user.password,
            );
            if (!passwordValid) {
              throw new Error('Password does not match');
            }
            const token = JWT.sign(
              { email, id: user.id },
              JWT_SECRET,
              {
                expiresIn: '1d',
              },
            );

            return {
              token,
            };
          }
          throw new Error('User not found');
        });
      },
      async uploadAvatar(root, { file }, context) {
        const { stream, filename, mimetype, encoding } = await file;
        const bucket = 'pepe-graphbook';
        const params = {
          Bucket: bucket,
          Key: `${context.user.id}/${filename}`,
          ACL: 'public-read',
          Body: stream,
        };

        const response = await s3.upload(params).promise();

        return User.update(
          {
            avatar: response.Location,
          },
          {
            where: {
              id: context.user.id,
            },
          },
        ).then(() => {
          return {
            filename,
            url: response.Location,
          };
        });
      },
      signup(root, { email, password, username }, context) {
        return User.findAll({
          where: {
            [Op.or]: [{ email }, { username }],
          },
          raw: true,
        }).then(async users => {
          if (users.length) {
            throw new Error('User already exists');
          } else {
            return bcrypt.hash(password, 10).then(hash => {
              return User.create({
                email,
                password: hash,
                username,
                activated: 1,
              }).then(newUser => {
                const token = JWT.sign(
                  { email, id: newUser.id },
                  JWT_SECRET,
                  {
                    expiresIn: '1d',
                  },
                );
                return {
                  token,
                };
              });
            });
          }
        });
      },
    },
  };

  return resolvers;
}
