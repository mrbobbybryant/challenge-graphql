import * as bcrypt from 'bcryptjs';
import User from 'models/users/user';
import jwt from '../shared/jwt';

export default async (_, { input }, { redis }) => {
  const { code, password } = input;
  const key = `verificationCode:${code}`;

  const userId = await redis.getAsync(key);

  if (!userId) {
    ApolloError({
      code: 400,
      field: 'code',
      message: 'Reset password is invalid or expired.',
    });
  }

  if (8 > password.length) {
    ApolloError({
      code: 400,
      field: 'password',
      message: 'The password must be 8 characters.',
    });
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT),
  );

  try {
    await User.update(userId, { password: hashedPassword });
    await redis.del(key);

    const token = jwt(userId);
    const userObj = await User.getUserById(userId);

    return {
      ...userObj,
      jwt: token,
    };
  } catch (error) {
    ApolloError({
      code: 400,
      message: 'Error resetting password.',
    });
  }
};
