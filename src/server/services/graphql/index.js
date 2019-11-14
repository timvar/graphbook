/* eslint-disable object-shorthand */
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import JWT from 'jsonwebtoken';
import Resolvers from './resolvers';
import Schema from './schema';
import auth from './auth';

const { JWT_SECRET } = process.env;

export default utils => {
  const executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers.call(utils),
    schemaDirectives: {
      auth: auth,
    },
  });

  const server = new ApolloServer({
    schema: executableSchema,
    context: async ({ req }) => {
      const authorization = req.headers.authorization;
      if (typeof authorization !== typeof undefined) {
        const search = 'Bearer';
        const regEx = new RegExp(search, 'ig');
        const token = authorization.replace(regEx, '').trim();
        return JWT.verify(token, JWT_SECRET, function(err, result) {
          console.log('result', result);
          console.log('apollo server err', err);

          if (err) {
            return req;
          } else {
            return utils.db.models.User.findByPk(result.id).then(
              user => {
                return Object.assign({}, req, { user });
              },
            );
          }
        });
      }
      return req;
    },
  });

  return server;
};

/*
context: async ({ req }) => {
      const { authorization } = req.headers;
      console.log('authorization', authorization);
      if (typeof authorization !== typeof undefined) {
        const search = 'Bearer';
        const regEx = new RegExp(search, 'ig');
        const token = authorization.replace(regEx, '').trim();
        console.log('token', token);
        return JWT.verify(token, JWT_SECRET, (err, result) => {
          if (err) {
            return req;
          }
          console.log('result', result);
          console.log('utils', utils);
          return utils.db.models.User.findById(result.id).then(
            user => {
              return { ...req, user };
            },
          );
        });
      }
      return req;
    },


*/
