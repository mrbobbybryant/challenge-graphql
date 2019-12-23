import User from 'models/users/user';

export default async (_, __, { user, req }) => {
  if (!user) {
    ApolloError({
      code: 401
    });
  }

  const userObj = await User.getUserById(user.id);

  if (!userObj) {
    ApolloError({
      code: 401
    });
  }

  return userObj;
};
