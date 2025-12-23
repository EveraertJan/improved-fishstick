exports.up = function(knex) {
  return knex.schema
    .createTable('tags', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').notNullable();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.string('name', 100).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());

      table.index('user_id');
      table.index('name');
      table.unique(['user_id', 'name']);
    })
    .createTable('item_tags', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('item_id').notNullable();
      table.uuid('tag_id').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());

      table.foreign('item_id').references('saved_items.id').onDelete('CASCADE');
      table.foreign('tag_id').references('tags.id').onDelete('CASCADE');
      table.unique(['item_id', 'tag_id']);
      table.index('item_id');
      table.index('tag_id');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('item_tags')
    .dropTableIfExists('tags');
};