import { omit } from 'lodash';
import * as bcrypt from 'bcryptjs';
import Validator from 'validatorjs';
import User from 'models/users/user';
import jwt from '../shared/jwt';
import queue from 'queue/setup';
import parse from 'parse-full-name';

export const signup = (User, jwt, queue) => async (_, { input }) => {
  const { full_name } = input;

  const rules = {
    password: 'min:8',
    email: 'email',
  };

  const validation = new Validator(input, rules);
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

  const password = await bcrypt.hash(
    input.password,
    parseInt(process.env.SALT),
  );

  const isFullName = 2 <= full_name.split(' ').length ? true : false;
  const name = parse.parseFullName(full_name);

  try {
    const user = await User.create({
      ...omit(input, ['full_name']),
      first_name: isFullName ? name.first : name.last,
      last_name: isFullName ? name.last : null,
      role: 'user',
      password,
    });

    const token = await jwt(user.id);

    return {
      ...user,
      jwt: token,
    };
  } catch (error) {
    if ('users_email_unique' === error.constraint) {
      ApolloError({
        code: 400,
        field: 'email',
        message: 'A user with this email already exists.',
      });
    }
    console.log(error);
  }
};

export default signup(User, jwt, queue);
