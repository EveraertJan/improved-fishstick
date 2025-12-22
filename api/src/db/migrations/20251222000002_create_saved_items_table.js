exports.up = function(knex) {
  return knex.schema.createTable('saved_items', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.string('type', 50).notNullable();
    table.text('content');
    table.text('url');
    table.timestamp('date');
    table.string('title', 500);
    table.text('description');
    table.string('author', 255);
    table.string('site_name', 255);
    table.text('article_text');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('saved_items');
};
