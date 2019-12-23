import * as bcrypt from 'bcryptjs';
import User from 'models/users/user';
import Validator from 'validatorjs';

export const updatePassword = (User, bcrypt) => async (
  _,
  { input },
  { user }
) => {
  if (!user) {
    ApolloError({
      code: 401
    });
  }

  const { oldPassword, newPassword, newPasswordAgain } = input;

  const rules = {
    newPassword: 'min:8'
  };

  const validation = new Validator(input, rules);
  const valid = validation.passes() ? true : validation.errors.all();

  if (true !== valid && valid.newPassword) {
    ApolloError({
      code: 400,
      field: 'newPassword',
      message: 'The new password must be at least 8 characters.'
    });
  }

  if (newPassword !== newPasswordAgain) {
    ApolloError({
      code: 400,
      field: 'newPassword',
      message: 'The new passwords do not match.'
    });
  }

  const userObj = await User.get('id', user.id);

  if (!userObj) {
    ApolloError({
      code: 401,
      message: 'Invalid User.'
    });
  }

  const match = await bcrypt.compare(oldPassword, userObj.password);

  if (!match) {
    ApolloError({
      code: 400,
      field: 'oldPassword',
      message: 'Invalid Password.'
    });
  }

  const password = await bcrypt.hash(newPassword, parseInt(process.env.SALT));

  await User.update(user.id, { password });

  return true;
};

export default updatePassword(User, bcrypt);
