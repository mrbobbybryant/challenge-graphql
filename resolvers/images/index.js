import { vendorAuth } from 'shared/authenticated';
import singleUpload from './mutations/single-upload';
import deleteUpload from './mutations/delete-upload';

const typeDefs = `
  type File {
    url: String!
    id: Int!
  }
`;

const resolvers = {
  Query: {},
  Mutation: {
    singleUpload,
    deleteUpload,
  },
};

export default { resolvers, typeDefs };
