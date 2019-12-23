import User from 'models/users/user';

export default async () => {
  return await User.query()
    .whereIn('role', ['admin', 'track'])
    .orderBy('last_name');
};
