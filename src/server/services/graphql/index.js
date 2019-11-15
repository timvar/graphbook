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
      const { authorization } = req.headers;
      if (typeof authorization !== typeof undefined) {
        const search = 'Bearer';
        const regEx = new RegExp(search, 'ig');
        const token = authorization.replace(regEx, '').trim();
        return JWT.verify(token, JWT_SECRET, (err, result) => {
          if (err) {
            return req;
          }
          return utils.db.models.User.findByPk(result.id).then(
            user => {
              return Object.assign({}, req, { user });
            },
          );
        });
      }
      return req;
    },
  });

  return server;
};
