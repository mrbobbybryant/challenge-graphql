import Card from 'models/users/card';

export default async (_, { id }, { user }) => {
  if (!user) {
    ApolloError({
      code: 401,
    });
  }
  const card = await Card.get(id);

  if (!card) {
    return null;
  }

  if (parseInt(user.id) !== card.user_id) {
    ApolloError({
      code: 400,
      message: 'Unauthorized',
    });
  }

  return {
    ...card,
    stripe_id: user.stripe_id,
  };
};
