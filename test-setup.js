import { graphql } from 'graphql';
import { typeDefs } from './resolvers';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

const schema = makeExecutableSchema({ typeDefs });

addMockFunctionsToSchema({
  schema,
  mocks: {
    Int: () => 6,
    Float: () => 22.1,
    String: () => 'Hello',
    Boolean: () => true,
  },
});

global.graphql = (query, variables, parent, context) =>
  graphql(schema, query, parent, context, variables);

global.dbMock = (fakes = {}, returns = []) => {
  let keys = Object.keys(fakes);
  let proxy = new Proxy(
    {},
    {
      get: (target, name) => {
        if (fakes[name]) {
          //if last key, return the value

          if (name === keys[keys.length - 1] || returns.includes(name))
            return fakes[name];

          return value => {
            fakes[name](value);
            return proxy;
          };
        }
        return () => proxy;
      },
    },
  );

  return proxy;
};
