import { gql } from 'apollo-server-express';
import { adminAuth } from 'shared/authenticated';

// Mutations
import updateUser from './mutations/update-user';
import addCard from './mutations/add-card';
import updateCard from './mutations/update-card';
import deleteUser from './mutations/delete-user';
import createUser from './mutations/create-user';
import updateSelf from './mutations/update-self';

// Queries
import getUsers from './queries/users';
import me from './queries/me';
import getCards from './queries/get-cards';
import getCard from './queries/get-card';
import getUser from './queries/get-user';
import getAllUsers from './queries/get-all-users';
import isDefault from './queries/is-default';
import image from './queries/image';
import test from './queries/test';

const typeDefs = gql`
  type User {
    id: Int!
    email: String
    jwt: String
    first_name: String
    last_name: String
    role: String
    name: String
    image: String
    stripe_account_id: String
  }

  type UsersList {
    results: [User]
    count: Int
  }

  type Card {
    id: Int!
    name: String
    zipcode: String
    card_id: String!
    brand: String
    expiration: String
    last4: String
    isDefault: Boolean
  }

  input UpdateUserMeta {
    key: String!
    value: JSON
  }

  input UpdatePasswordInput {
    oldPassword: String!
    newPassword: String!
    newPasswordAgain: String!
  }

  enum UserRole {
    user
    admin
  }

  input UpdateUserInput {
    user_id: ID!
    email: String!
    full_nane: String!
    password: String
    role: UserRole
  }

  input CreateUserInput {
    email: String!
    full_name: String!
    role: UserRole!
    password: String
  }

  input AddCardInput {
    token: String!
    name: String!
    zipcode: String!
    isDefault: Boolean
  }

  input UpdateCardInput {
    id: Int!
    name: String
    zipcode: String
    exp_year: String
    exp_month: String
    isDefault: Boolean
  }

  input GetUsersInput {
    queryString: String
    sort: SortDirection
    page: String
    limit: String
  }

  input UpdateSelfInput {
    first_name: String
    last_name: String
    email: String
    new_password: String
    old_password: String
    image: String
  }

  input GetUserEventsInput {
    sort: SortDirection
    page: String
    limit: String
    queryString: String
  }
`;

const resolvers = {
  Query: {
    getUsers: (parent, args, context, info) =>
      adminAuth(parent, args, context, info, getUsers),
    // getUser: (parent, args, context, info) =>
    //   adminAuth(parent, args, context, info, getUser),
    getUser,
    getAllUsers: (parent, args, context, info) =>
      adminAuth(parent, args, context, info, getAllUsers),
    test: (parent, args, context, info) =>
      adminAuth(parent, args, context, info, test),
    me,
    getCards,
    getCard,
  },
  Mutation: {
    updateUser,
    addCard,
    updateCard,
    updateSelf,
    deleteUser: (parent, args, context, info) =>
      adminAuth(parent, args, context, info, deleteUser),
    createUser: (parent, args, context, info) =>
      adminAuth(parent, args, context, info, createUser),
  },
  User: {
    image,
    name: ({ first_name, last_name, middle_name }) => {
      if (!first_name || !last_name) {
        return null;
      }

      if (middle_name) {
        return `${first_name} ${middle_name} ${last_name}`;
      }
      return `${first_name} ${last_name}`;
    },
  },
  Card: {
    expiration: async ({ exp_month, exp_year }) => {
      const month = 1 === exp_month.length ? `0${exp_month}` : exp_month;
      return `${month}/${exp_year.slice(-2)}`;
    },
    isDefault,
  },
};

export default { resolvers, typeDefs };
