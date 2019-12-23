import User from 'models/users/user';

export default async (_, { input }) => {
  const { limit = 15, page = 1, queryString, sort = 'asc' } = input;

  const query = User.query();

  if (queryString) {
    query.where('first_name', 'ilike', `%${queryString}%`);
    query.orWhere('last_name', 'ilike', `%${queryString}%`);
    query.orWhere('email', 'ilike', `%${queryString}%`);
  }

  const count = await query.clone().count();

  const results = await query
    .offset(limit * page - limit)
    .limit(limit)
    .orderBy('last_name', sort.toUpperCase());

  return {
    count: count.length ? parseInt(count[0].count, 10) : 0,
    results: results,
  };
};
