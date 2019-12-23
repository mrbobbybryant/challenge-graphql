import stripe from '../index';

export default async ({ stripe_id, token, isDefault }) => {
  const result = await stripe.customers.createSource(stripe_id, {
    source: token
  });

  if (isDefault) {
    await stripe.customers.update(stripe_id, {
      default_source: result.id
    });
  }

  return result;
};
