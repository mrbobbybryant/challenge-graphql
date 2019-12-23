import stripe from '../index';

export default async info => {
  const { stripe_id, total, user_id, source } = info;
  const totalInCents = Math.round(parseFloat(total) * 100);

  try {
    return await stripe.charges.create({
      amount: totalInCents,
      customer: stripe_id,
      currency: 'usd',
      source,
      metadata: {
        userId: user_id,
      },
    });
  } catch (error) {
    console.log(error);
    ApolloError({
      code: 400,
      field: 'credit_card',
      message: error.message,
    });
  }
};
