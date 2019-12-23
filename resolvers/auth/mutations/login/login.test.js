import { login } from './index';

const get = jest.fn();
const User = {
  get,
};

const compare = jest.fn();
const jwt = jest.fn();
const bcrypt = {
  compare,
};

const testLogin = login(User, bcrypt, jwt);

describe('email login Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Should return an error if user is not found.', async () => {
    get.mockReturnValueOnce(null);
    try {
      const result = await testLogin(
        {},
        {
          input: {
            email: 'bobby@crossfield',
            password: '1234',
          },
        },
        {},
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.message).toEqual('Invalid email or password.');
      expect(info.code).toEqual(400);
      expect(info.field).toEqual('email');
    }
  });

  test('Should return an error if the password is not valid.', async () => {
    get.mockReturnValueOnce({
      id: 1,
      email: 'bobby@crossfield.com',
      password: '1234',
    });
    compare.mockReturnValueOnce(false);
    try {
      const result = await testLogin(
        {},
        {
          input: {
            email: 'bobby@crossfield.com',
            password: '1234',
          },
        },
        {},
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.message).toEqual('Invalid email or password.');
      expect(info.code).toEqual(400);
      expect(info.field).toEqual('email');
    }
  });

  test('Should work.', async () => {
    get.mockReturnValueOnce({
      id: 1,
      email: 'bobby@crossfield.com',
      password: '1234',
    });
    compare.mockReturnValueOnce(true);
    jwt.mockReturnValueOnce('IOIJIO');

    const result = await testLogin(
      {},
      {
        input: {
          email: 'bobby@crossfield.com',
          password: '1234',
        },
      },
      {},
    );

    expect(result).toMatchSnapshot();
  });
});
