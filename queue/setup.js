import amqp from 'amqp-modern';

export default amqp(process.env.CLOUDAMQP_URL);
