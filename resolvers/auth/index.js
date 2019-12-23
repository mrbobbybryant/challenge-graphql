import { gql } from 'apollo-server-express';
import signup from './mutations/signup';
import login from './mutations/login';
import forgotPassword from './mutations/forgot-password-request';
import changePassword from './mutations/forgot-password-change';

const typeDefs = gql`
  input SignupInput {
    password: String!
    full_name: String!
    email: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UserChangePasswordInput {
    password: String!
    code: String!
  }
`;

const resolvers = {
  Mutation: {
    signup,
    login,
    forgotPassword,
    changePassword,
  },
};

export default { resolvers, typeDefs };
