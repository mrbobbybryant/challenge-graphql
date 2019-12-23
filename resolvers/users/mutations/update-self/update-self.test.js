import { updateSelf } from './index';

const getUserById = jest.fn();
const update = jest.fn();
const User = {
  getUserById,
  update,
};

const compare = jest.fn();
const hash = jest.fn();
const bcrypt = {
  compare,
  hash,
};

const testUpdateSelf = updateSelf(User, bcrypt);

describe('Update User Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Should return an error if the user is not logged in.', async () => {
    try {
      const result = await testUpdateSelf(
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
    getUserById.mockReturnValueOnce({ email: 'bobby@crossfield.com' });
    try {
      const result = await testUpdateSelf(
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

  test('Should return an error if the the new_password is not valid.', async () => {
    getUserById.mockReturnValueOnce({ email: 'bobby@crossfield.com' });
    try {
      const result = await testUpdateSelf(
        {},
        {
          input: {
            user_id: 13,
            new_password: '1234',
          },
        },
        { user: { id: 1, role: 'admin' } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.code).toEqual(400);
      expect(info.message).toEqual(
        'The new password is too short. Min length is 8.',
      );
      expect(info.field).toEqual('new_password');
    }
  });

  test('Should return an error if the user is not found in the database', async () => {
    getUserById.mockReturnValueOnce(null);
    try {
      const result = await testUpdateSelf(
        {},
        {
          input: {
            user_id: 13,
          },
        },
        { user: { id: 1, role: 'admin' } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.code).toEqual(400);
      expect(info.message).toEqual('Invalid User');
    }
  });

  test('Should return an error if the old_password is not correct', async () => {
    getUserById.mockReturnValueOnce({ id: 1, password: 'yolo' });
    compare.mockReturnValueOnce(false);
    try {
      const result = await testUpdateSelf(
        {},
        {
          input: {
            user_id: 13,
            old_password: '1234',
            new_password: '123456778',
          },
        },
        { user: { id: 1, role: 'admin' } },
      );
      throw 'This should not run';
    } catch (error) {
      const info = JSON.parse(error.message);
      expect(info.code).toEqual(400);
      expect(info.field).toEqual('old_password');
      expect(info.message).toEqual('Invalid Password.');
    }
  });

  test('Should not save a password if the user does not submit.', async () => {
    getUserById.mockReturnValueOnce({
      id: 1,
      password: 'yolo',
      full_name: 'Tom Johson',
      email: 'john@crossfield.com',
    });
    compare.mockReturnValueOnce(true);
    const result = await testUpdateSelf(
      {},
      {
        input: {
          user_id: 13,
          full_name: 'Tom Johnson',
        },
      },
      { user: { id: 1, role: 'admin' } },
    );

    expect(update).toBeCalledWith(1, {
      email: 'john@crossfield.com',
      first_name: 'Tom',
      last_name: 'Johnson',
    });
  });

  test('Should save a new_password if it is sent.', async () => {
    getUserById.mockReturnValueOnce({
      id: 1,
      password: 'yolo',
      full_name: 'Tom Johnson',
      email: 'john@crossfield.com',
    });
    compare.mockReturnValueOnce(true);
    hash.mockReturnValueOnce('2222');
    const result = await testUpdateSelf(
      {},
      {
        input: {
          user_id: 13,
          full_name: 'John Johnson',
          old_password: '1234',
          new_password: '123456778',
        },
      },
      { user: { id: 1, role: 'admin' } },
    );

    expect(update).toBeCalledWith(1, {
      email: 'john@crossfield.com',
      first_name: 'John',
      last_name: 'Johnson',
      password: '2222',
    });
  });
});
