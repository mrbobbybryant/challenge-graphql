import { signup } from './index';

const create = jest.fn();
const jwt = jest.fn();

const queue = {
  publish: jest.fn(),
};
const User = {
  create,
};

const set = jest.fn();
const redis = {
  set,
};

const testSignup = signup(
  User,
  jwt,

  queue,
);

describe('email signup Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Should return an error if the password is not long enough.', async () => {
    try {
      const result = await testSignup(
        {},
        {
          input: {
            email: 'bobby@crossfield.com',
            password: '1234',
            full_name: 'Bobby Bryant',
          },
        },
        { redis },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.message).toEqual(
        'The password must be at least 8 characters.',
      );
      expect(info.code).toEqual(400);
      expect(info.field).toEqual('password');
    }
  });

  test('Should return an error if the email is not valid.', async () => {
    try {
      const result = await testSignup(
        {},
        {
          input: {
            email: 'bobbycrossfield.com',
            password: '12345678',
            full_name: 'Bobby Bryant',
          },
        },
        { redis },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.message).toEqual('The email format is invalid.');
      expect(info.code).toEqual(400);
      expect(info.field).toEqual('email');
    }
  });

  test('Should return an error if the email is already taken.', async () => {
    create.mockRejectedValueOnce({ constraint: 'users_email_unique' });

    try {
      const result = await testSignup(
        {},
        {
          input: {
            email: 'bobby@crossfield.com',
            password: '12345678',
            full_name: 'Bobby Bryant',
          },
        },
        { redis },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.message).toEqual('A user with this email already exists.');
      expect(info.code).toEqual(400);
      expect(info.field).toEqual('email');
    }
  });

  test('Should work.', async () => {
    create.mockReturnValueOnce({ id: 1, email: 'bobby@crossfield.com' });
    jwt.mockReturnValueOnce('UIHUIHUI');

    const result = await testSignup(
      {},
      {
        input: {
          email: 'bobby@crossfield.com',
          password: '$Winecountry1',
          full_name: 'Bobby Bryant',
        },
      },
      { redis },
    );

    expect(result).toMatchSnapshot();
  });
});
