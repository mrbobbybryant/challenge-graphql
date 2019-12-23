exports.up = async (knex, Promise) => {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('first_name');
    table.string('last_name');
    table.string('email').unique();
    table.string('password').notNullable();
    table.string('role');
    table.string('stripe_id');
  });

  await knex.schema.createTable('cards', table => {
    table.increments('id').primary();
    table.string('last4');
    table.string('brand');
    table.string('zipcode');
    table.string('exp_month');
    table.string('exp_year');
    table.string('card_id');
    table.boolean('is_default');
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });

  await knex.schema.createTable('images', table => {
    table.increments('id').primary();
    table.string('url');
  });

  await knex.schema.createTable('projects', table => {
    table.increments('id').primary();
    table.string('name');
    table.text('description', ['longtext']);
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {};
