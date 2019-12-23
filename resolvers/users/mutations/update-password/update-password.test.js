import { updatePassword } from './index';

const get = jest.fn();
const update = jest.fn();
const User = {
  get,
  update,
};

const compare = jest.fn();
const hash = jest.fn();
const bcrypt = {
  compare,
  hash,
};

const testUpdatePassword = updatePassword(User, bcrypt);

describe('Update Password Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Should return an error if the user is not logged in.', async () => {
    try {
      const result = await testUpdatePassword(
        {},
        {
          input: {
            newPassword: '1234567',
            newPasswordAgain: '1234567',
            oldPassword: '12345678',
          },
        },
        {},
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.code).toEqual(401);
    }
  });

  test('Should return an error if the password is not long enough.', async () => {
    try {
      const result = await testUpdatePassword(
        {},
        {
          input: {
            newPassword: '1234567',
            newPasswordAgain: '1234567',
            oldPassword: '12345678',
          },
        },
        { user: { id: 1 } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.message).toEqual(
        'The new password must be at least 8 characters.',
      );
      expect(info.code).toEqual(400);
      expect(info.field).toEqual('newPassword');
    }
  });

  test('Should return an error if the new passwords do not match.', async () => {
    try {
      const result = await testUpdatePassword(
        {},
        {
          input: {
            newPassword: '12345678',
            newPasswordAgain: '12345679',
            oldPassword: '12345678',
          },
        },
        { user: { id: 1 } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.message).toEqual('The new passwords do not match.');
      expect(info.code).toEqual(400);
      expect(info.field).toEqual('newPassword');
    }
  });

  test('Should return an error if the user is not found.', async () => {
    get.mockReturnValueOnce(null);
    try {
      const result = await testUpdatePassword(
        {},
        {
          input: {
            newPassword: '12345678',
            newPasswordAgain: '12345678',
            oldPassword: '12345678',
          },
        },
        { user: { id: 1 } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.message).toEqual('Invalid User.');
      expect(info.code).toEqual(401);
    }
  });

  test('Should return an error if the oldPassword does not match.', async () => {
    get.mockReturnValueOnce({ id: 1, password: '2222323242123' });
    compare.mockReturnValueOnce(false);
    try {
      const result = await testUpdatePassword(
        {},
        {
          input: {
            newPassword: '12345678',
            newPasswordAgain: '12345678',
            oldPassword: '12345678',
          },
        },
        { user: { id: 1 } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.message).toEqual('Invalid Password.');
      expect(info.code).toEqual(400);
      expect(info.field).toEqual('oldPassword');
    }
  });

  test('Should work.', async () => {
    get.mockReturnValueOnce({ id: 1, password: '2222323242123' });
    compare.mockReturnValueOnce(true);
    const result = await testUpdatePassword(
      {},
      {
        input: {
          newPassword: '12345678',
          newPasswordAgain: '12345678',
          oldPassword: '12345678',
        },
      },
      { user: { id: 1 } },
    );

    expect(update).toBeCalled();
  });
});
