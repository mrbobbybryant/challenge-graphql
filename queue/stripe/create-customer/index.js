import createCustomer from 'shared/stripe/customers/create';
import User from 'models/users/user';

export default {
  channel: 'create-customer',
  process: async ({ id, email, first_name, last_name, cellphone }) => {
    const customer = await createCustomer({
      user_id: id,
      email,
      name: `${first_name} ${last_name}`,
      phone: cellphone
    });
    return User.update(id, { stripe_id: customer.id });
  }
};
