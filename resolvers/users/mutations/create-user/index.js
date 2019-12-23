import * as bcrypt from 'bcryptjs';
import Validator from 'validatorjs';
import User from 'models/users/user';
import queue from 'queue/setup';
import generatePassword from 'resolvers/auth/mutations/shared/generate-password';

export const signup = (User, queue) => async (_, { input }) => {
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

  const userPassword = input.password ? input.password : generatePassword();
  const password = await bcrypt.hash(userPassword, parseInt(process.env.SALT));

  try {
    const user = await User.create({
      ...input,
      password,
    });

    queue.publish('create-customer', user);
    //TODO: Integrate with email service

    return user;
  } catch (error) {
    if ('users_email_unique' === error.constraint) {
      ApolloError({
        code: 400,
        field: 'email',
        message: 'A user with this email already exists.',
      });
    }

    if ('users_cellphone_unique' === error.constraint) {
      ApolloError({
        code: 400,
        field: 'cellphone',
        message: 'A user with this phone number already exists.',
      });
    }
    console.log(error);
  }
};

export default signup(User, queue);
