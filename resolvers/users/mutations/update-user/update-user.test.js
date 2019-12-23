import { updateUser } from './index';

const getUserById = jest.fn();
const update = jest.fn();
const User = {
  getUserById,
  update,
};

const testUpdateUser = updateUser(User);

describe('Update User Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Should return an error if the user is not logged in.', async () => {
    try {
      const result = await testUpdateUser(
        {},
        {
          input: {
            user_id: 13,
            email: 'bobbi@crossfield.com',
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

  test('Should return an error if the email is not valid.', async () => {
    try {
      const result = await testUpdateUser(
        {},
        {
          input: {
            user_id: 13,
            email: 'bobbicrossfield.com',
          },
        },
        { user: { id: 1, role: 'admin' } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.code).toEqual(400);
      expect(info.message).toEqual('The email format is invalid.');
      expect(info.field).toEqual('email');
    }
  });

  test('Should return an error if the current user is not an admin and its not their account.', async () => {
    try {
      getUserById.mockReturnValueOnce({ id: 14 });
      const result = await testUpdateUser(
        {},
        {
          input: {
            user_id: 13,
            email: 'bobbi@crossfield.com',
          },
        },
        { user: { id: 1, role: 'vendor' } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.code).toEqual(403);
      expect(info.message).toEqual('You are not allowed to do this.');
    }
  });

  test('Should return an error if the user is trying to change the birthday or expiration and is not an admin.', async () => {
    try {
      getUserById.mockReturnValueOnce({ id: 1 });
      const result = await testUpdateUser(
        {},
        {
          input: {
            user_id: 13,
            email: 'bobby@crossfield.com',
            birthday: '04/04/1982',
          },
        },
        { user: { id: 1, role: 'vendor' } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.code).toEqual(403);
      expect(info.message).toEqual('You are not allowed to do this.');
    }
  });

  test('Should return an error if the user is trying to change the password and is not an admin.', async () => {
    try {
      getUserById.mockReturnValueOnce({ id: 1 });
      const result = await testUpdateUser(
        {},
        {
          input: {
            user_id: 13,
            email: 'bobby@crossfield.com',
            password: '12345678',
          },
        },
        { user: { id: 1, role: 'vendor' } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.code).toEqual(403);
      expect(info.message).toEqual('You are not allowed to do this.');
    }
  });

  test('Should return an error if the new password is too short.', async () => {
    try {
      getUserById.mockReturnValueOnce({ id: 1 });
      const result = await testUpdateUser(
        {},
        {
          input: {
            user_id: 13,
            email: 'bobby@crossfield.com',
            password: '1234567',
          },
        },
        { user: { id: 1, role: 'admin' } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.code).toEqual(400);
      expect(info.message).toEqual(
        'The password is too short. Min length is 8.',
      );
      expect(info.field).toEqual('password');
    }
  });

  test('Should not allow a user the ability to change thier own role if they are not an admin.', async () => {
    getUserById.mockReturnValueOnce({ id: 13, role: 'user' });
    try {
      const result = await testUpdateUser(
        {},
        {
          input: {
            user_id: 13,
            role: 'admin',
          },
        },
        { user: { id: 13, role: 'user' } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.code).toEqual(403);
      expect(info.message).toEqual('You are not allowed to do this.');
    }
  });

  test("Should allow an admin to change a user's role.", async () => {
    getUserById.mockReturnValueOnce({ id: 13, role: 'user' });
    const result = await testUpdateUser(
      {},
      {
        input: {
          user_id: 13,
          role: 'user',
        },
      },
      { user: { id: 14, role: 'admin' } },
    );
    expect(update.mock.calls[0][1]).toEqual({
      role: 'user',
    });
  });
});
