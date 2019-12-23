import User from 'models/users/user';
import uuid from 'uuid';

export const requestResetPassword = (User, resetCode) => async (
  _,
  { email },
  { redis },
) => {
  if (!email) {
    ApolloError({
      code: 400,
      message: 'You must provide your email address.',
    });
  }

  const user = await User.get('email', email);

  if (!user) {
    ApolloError({
      code: 400,
      field: 'email',
      message: "A user with that email doesn't exist.",
    });
  }

  const code = await resetCode(redis, user.id);
  //TODO: Send Email

  return true;
};

const resetCode = async (redis, user_id) => {
  const id = uuid.v4();

  await redis.set(`verificationCode:${id}`, user_id, 'ex', 60 * 60 * 24);

  return id;
};

export default requestResetPassword(User, resetCode);
