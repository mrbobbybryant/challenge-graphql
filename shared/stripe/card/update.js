import stripe from '../index';

export default async ({ stripe_id, card_id, payload }) => {
  return await stripe.customers.updateCard(stripe_id, card_id, payload);
};
