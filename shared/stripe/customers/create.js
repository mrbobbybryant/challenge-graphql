import stripe from '../index';

export default async ({ user_id, email, name, phone }) => {
  return await stripe.customers.create({
    email,
    name,
    phone,
    metadata: {
      user_id
    }
  });
};
