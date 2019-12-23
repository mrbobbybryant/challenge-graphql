import stripe from '../index';

export default async ({ card_id, stripe_id }) => {
  return await stripe.customers.retrieveCard(stripe_id, card_id);
};
