import {
  SchemaDirectiveVisitor,
  AuthenticationError,
} from 'apollo-server-express';

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const ctx = args[2];
      console.log('ctx', ctx);
      console.log('ctx.user', ctx.user);
      console.log('...args', args[0], args[1]);
      if (ctx.user) {
        return await resolve.apply(this, args);
      } else {
        throw new AuthenticationError(
          'Uusi versio ja vikaa löytyy Auth palikasta',
        );
      }
    };
  }
}

export default AuthDirective;
