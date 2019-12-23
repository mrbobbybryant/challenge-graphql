require('dotenv').config();

const connection = {
  client: 'pg',
  connection: process.env.DB_SSL
    ? `${process.env.DATABASE_URL}?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory`
    : process.env.DATABASE_URL,
};
module.exports = {
  development: connection,
  production: connection,
  local: connection,
};
