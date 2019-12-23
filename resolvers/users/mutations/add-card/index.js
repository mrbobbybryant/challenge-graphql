import User from 'models/users/user';
import Card from 'models/users/card';
import createCard from 'shared/stripe/card/create';

export default async (
  _,
  { input: { token, isDefault, name, zipcode } },
  { user },
) => {
  if (!user) {
    ApolloError({
      code: 401,
    });
  }

  try {
    const result = await createCard({
      stripe_id: user.stripe_id,
      token,
      isDefault,
    });

    const card = await Card.create({
      card_id: result.id,
      brand: result.brand,
      exp_month: result.exp_month,
      exp_year: result.exp_year,
      zipcode,
      name,
      last4: result.last4,
      user_id: user.id,
    });

    if (isDefault || !user.default_card) {
      await User.update(user.id, { default_card: card.id });
    }

    return true;
  } catch (error) {
    ApolloError({
      code: 400,
      message: error.message,
    });
  }
};
