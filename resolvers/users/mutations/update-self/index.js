import Validator from 'validatorjs';
import User from 'models/users/user';
import * as bcrypt from 'bcryptjs';
import parse from 'parse-full-name';

export const updateSelf = (User, bcrypt) => async (_, { input }, { user }) => {
  let password = false;
  const { email, new_password, old_password, full_name } = input;
  let isFullName, name;

  if (!user) {
    return ApolloError({
      code: 401,
    });
  }

  const userObj = await User.getUserById(user.id);

  if (!userObj) {
    ApolloError({
      code: 400,
      message: 'Invalid User',
    });
  }

  const rules = {
    email: 'email',
    new_password: 'min:8',
  };

  const validation = new Validator({ email, new_password }, rules, {
    min: {
      string: 'The :attribute is too short. Min length is :min.',
    },
  });

  const valid = validation.passes() ? true : validation.errors.all();

  if (true !== valid && valid.new_password) {
    ApolloError({
      code: 400,
      field: 'new_password',
      message: valid.new_password[0],
    });
  }

  if (true !== valid && valid.email) {
    ApolloError({
      code: 400,
      field: 'email',
      message: valid.email[0],
    });
  }

  if (new_password) {
    const match = await bcrypt.compare(old_password, userObj.password);

    if (!match) {
      ApolloError({
        code: 400,
        field: 'old_password',
        message: 'Invalid Password.',
      });
    }

    password = await bcrypt.hash(new_password, parseInt(process.env.SALT));
  }

  if (full_name) {
    isFullName = 2 <= full_name.split(' ').length ? true : false;
    name = parse.parseFullName(full_name);
  }

  if (!password) {
    await User.update(user.id, {
      email: email ? email : userObj.email,
      ...(full_name
        ? {
            first_name: isFullName ? name.first : name.last,
            last_name: isFullName ? name.last : null,
          }
        : {}),
    });
  } else {
    await User.update(user.id, {
      email: email ? email : userObj.email,
      ...(full_name
        ? {
            first_name: isFullName ? name.first : name.last,
            last_name: isFullName ? name.last : null,
          }
        : {}),
      password,
    });
  }

  return await User.getUserById(user.id);
};

export default updateSelf(User, bcrypt);
