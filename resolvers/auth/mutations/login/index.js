import * as bcrypt from 'bcryptjs';
import User from 'models/users/user';
import jwt from '../shared/jwt';

export const login = (User, bcrypt, jwt) => async (_, { input }) => {
  const { password, email } = input;
  const user = await User.get('email', email);

  if (!user) {
    ApolloError({
      code: 400,
      field: 'email',
      message: 'Invalid email or password.',
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    ApolloError({
      code: 400,
      field: 'email',
      message: 'Invalid email or password.',
    });
  }

  const token = jwt(user.id);
  return {
    ...user,
    jwt: token,
  };
};

export default login(User, bcrypt, jwt);
