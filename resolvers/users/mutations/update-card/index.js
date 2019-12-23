import { omit } from 'lodash';
import Card from 'models/users/card';
import User from 'models/users/user';
import updateCard from 'shared/stripe/card/update';

export default async (_, { input }, { user }) => {
  const { id, isDefault } = input;

  if (!user) {
    ApolloError({
      code: 401,
    });
  }

  const card = await Card.get(id);

  if (!card) {
    ApolloError({
      code: 400,
      message: 'invalid Card',
    });
  }

  const payload = input.zipcode
    ? omit({ ...input, address_zip: input.zipcode }, [
        'id',
        'zipcode',
        'name',
        'isDefault',
      ])
    : omit(input, ['id', 'name', 'isDefault']);

  await updateCard({
    stripe_id: user.stripe_id,
    card_id: card.card_id,
    payload,
  });

  await Card.update(id, omit(input, ['id', 'isDefault']));

  if (isDefault) {
    await User.update(user.id, { default_card: id });
  }

  return true;
};
