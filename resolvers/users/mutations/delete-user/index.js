import User from 'models/users/user';

export const deleteUser = User => async (_, { id }, { user }) => {
  if (!user) {
    return ApolloError({
      code: 401,
    });
  }

  const userObj = await User.getUserById(id);

  if (!userObj) {
    return ApolloError({
      code: 400,
      message: 'Invalid User',
    });
  }

  if (userObj.id === user.id) {
    return ApolloError({
      code: 400,
      message: 'You are not allowed to do this.',
    });
  }

  await User.delete(id);
  return true;
};

export default deleteUser(User);
