import {
  SchemaDirectiveVisitor,
  AuthenticationError,
} from 'apollo-server-express';

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const ctx = args[2];
      if (ctx.user) {
        return await resolve.apply(this, args);
      } else {
        throw new AuthenticationError(
          'Something wrong with AuthDirective...',
        );
      }
    };
  }
}

export default AuthDirective;
