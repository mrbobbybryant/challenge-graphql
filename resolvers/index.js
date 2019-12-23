import { mapValues } from 'lodash';
import rootTypes from './root-types';
import errorHandler from './error-handler';
import { makeExecutableSchema } from 'graphql-tools';
import { mergeResolvers } from 'merge-graphql-schemas';
import GraphQLJSON from 'graphql-type-json';
import GraphQLCalendar from 'types/date';
import GraphQLTime from 'types/time';

// Resolvers
import users from './users';
import auth from './auth';
import images from './images';

const resolvers = [users, auth, images];

export const typeDefs = [
  ...resolvers.map(resolver => resolver.typeDefs),
  rootTypes,
  `scalar JSON`,
  `scalar Upload`,
  `scalar DateTime`,
  `scalar Date`,
];

export default makeExecutableSchema({
  typeDefs,
  resolvers: {
    JSON: GraphQLJSON,
    DateTime: GraphQLTime,
    Date: GraphQLCalendar,
    ...mapValues(
      mergeResolvers(resolvers.map(resolver => resolver.resolvers)),
      resolver => mapValues(resolver, item => errorHandler(item)),
    ),
  },
});
