import knex from 'knex';
import { Model } from 'objection';

const client = knex({
  client: 'pg',
  connection: process.env.DB_SSL
    ? `${process.env.DATABASE_URL}?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory`
    : process.env.DATABASE_URL,
  pool: {
    min: 0,
    max: process.env.MAX_CON ? parseInt(process.env.MAX_CON, 10) : 1,
  },
});

Model.knex(client);

export default client;
