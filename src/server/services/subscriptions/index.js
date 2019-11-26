/* eslint-disable no-new */
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from 'graphql-tools';
import jwt from 'jsonwebtoken';
import { execute, subscribe } from 'graphql';
import Resolvers from '../graphql/resolvers';
import Schema from '../graphql/schema';
import auth from '../graphql/auth';

const { JWT_SECRET } = process.env;

export default utils => server => {
  const executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers.call(utils),
    schemaDirectives: {
      auth,
    },
  });

  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema: executableSchema,
      onConnect: async (params, socket) => {
        const authorization = params.authToken;
        if (typeof authorization !== typeof undefined) {
          const search = 'Bearer';
          const regEx = new RegExp(search, 'ig');
          const token = authorization.replace(regEx, '').trim();
          return jwt.verify(token, JWT_SECRET, (err, result) => {
            if (err) {
              throw new Error('Missing auth token!');
            } else {
              return utils.db.models.User.findByPk(result.id).then(
                user => {
                  return Object.assign({}, socket.upgradeReq, {
                    user,
                  });
                },
              );
            }
          });
        }
        throw new Error('Missing auth token!');
      },
    },
    {
      server,
      path: '/subscriptions',
    },
  );
};
