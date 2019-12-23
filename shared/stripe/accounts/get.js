import stripe from '../index';

export default async ({ account_id }) => {
  return await stripe.accounts.retrieve(account_id);
};
