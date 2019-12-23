import client from './setup';
import deleteUpload from './aws/delete-upload';
import createCustomer from './stripe/create-customer';

export default () => {
  client.config({
    onError: error => {
      console.log(error);
    },
    rejectionDelay: 30000,
    prefetch: 1,
  });

  client.consume(deleteUpload);
  client.consume(createCustomer);
};
