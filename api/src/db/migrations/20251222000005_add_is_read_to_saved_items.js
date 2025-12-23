exports.up = function(knex) {
  return knex.schema.table('saved_items', function(table) {
    table.boolean('is_read').defaultTo(false).notNullable();
    table.index('is_read');
  });
};

exports.down = function(knex) {
  return knex.schema.table('saved_items', function(table) {
    table.dropColumn('is_read');
  });
};
