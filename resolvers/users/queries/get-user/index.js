import User from 'models/users/user';

export default async (_, { id }) => {
  const userObj = await User.getUserById(id);

  if (!userObj) {
    ApolloError({
      code: 401,
      message: 'Invalid User',
    });
  }

  return userObj;
};
