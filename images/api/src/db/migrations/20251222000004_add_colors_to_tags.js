exports.up = function(knex) {
  return knex.schema.table('tags', function(table) {
    table.string('color1', 7).defaultTo('#1e7ea5');
    table.string('color2', 7).defaultTo('#17416e');
  });
};

exports.down = function(knex) {
  return knex.schema.table('tags', function(table) {
    table.dropColumn('color1');
    table.dropColumn('color2');
  });
};
