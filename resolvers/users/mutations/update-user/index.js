import { omit } from 'lodash';
import Validator from 'validatorjs';
import User from 'models/users/user';
import parse from 'parse-full-name';

export const updateUser = User => async (_, { input }, { user }) => {
  const { user_id, role, email, password, full_name } = input;
  let isFullName, name;

  if (!user) {
    return ApolloError({
      code: 401,
    });
  }

  if ('admin' !== user.role) {
    return ApolloError({
      code: 403,
      message: 'You are not allowed to do this.',
    });
  }

  const rules = {
    email: 'email',
    password: 'min:8',
  };

  const validation = new Validator({ email, password }, rules, {
    min: {
      string: 'The :attribute is too short. Min length is :min.',
    },
  });

  const valid = validation.passes() ? true : validation.errors.all();

  if (true !== valid && valid.password) {
    ApolloError({
      code: 400,
      field: 'password',
      message: valid.password[0],
    });
  }

  if (true !== valid && valid.email) {
    ApolloError({
      code: 400,
      field: 'email',
      message: valid.email[0],
    });
  }

  const userObj = await User.getUserById(user_id);

  if ('admin' !== user.role && parseInt(user_id) !== parseInt(userObj.id)) {
    return ApolloError({
      code: 403,
      message: 'You are not allowed to do this.',
    });
  }

  if (full_name) {
    isFullName = 2 <= full_name.split(' ').length ? true : false;
    name = parse.parseFullName(full_name);
  }

  await User.update(
    user_id,
    omit(
      {
        ...input,
        ...(full_name
          ? {
              first_name: isFullName ? name.first : name.last,
              last_name: isFullName ? name.last : null,
            }
          : {}),
        role: 'admin' === user.role ? role : userObj.role,
      },
      ['user_id', 'full_name'],
    ),
  );
  return await User.getUserById(user_id);
};

export default updateUser(User);
