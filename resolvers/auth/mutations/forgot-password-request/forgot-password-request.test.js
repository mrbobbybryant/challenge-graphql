import { requestResetPassword } from './index';

const twilio = jest.fn();
const set = jest.fn();
const redis = {
  set,
};

const get = jest.fn();
const User = { get };

const resetCode = jest.fn();

const testRequestResetPassword = requestResetPassword(User, twilio, resetCode);

describe('Request Reset Password Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Should return an error if email is empty.', async () => {
    try {
      const result = await testRequestResetPassword(
        {},
        {
          email: '',
        },
        { redis },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.message).toEqual('You must provide your email address.');
      expect(info.code).toEqual(400);
    }
  });

  test('Should return an error if email is set but user is not found.', async () => {
    get.mockReturnValueOnce(null);
    try {
      const result = await testRequestResetPassword(
        {},
        {
          email: 'bobby@crossfield.com',
        },
        { models: { User }, redis },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.message).toEqual("A user with that email doesn't exist.");
      expect(info.code).toEqual(400);
      expect(info.field).toEqual('email');
    }
  });

  test('Should work for reset by email.', async () => {
    get.mockReturnValueOnce({ id: 1, email: 'bobby@crossfield.com' });
    const result = await testRequestResetPassword(
      {},
      {
        email: 'bobby@crossfield.com',
      },
      { models: { User }, redis },
    );

    expect(result).toBeTruthy();
    expect(twilio).toBeCalledTimes(1);
  });
});
