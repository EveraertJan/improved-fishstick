
exports.up = function(knex) {

  knex.schema.hasTable('research_documents').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('research_documents', function(t) {
        t.increments('id').primary();
        t.uuid('uuid');
        t.integer('student_id').unsigned();
        t.foreign('student_id').references('students.id');
        t.string('title', 255);
        t.text('description');
        t.text('research_question');
        t.text('methodology');
        t.text('findings');
        t.text('conclusion');
        t.string('status', 50).defaultTo('draft'); // draft, in_progress, completed
        t.timestamps(true, true);
      });
    }
  })

  knex.schema.hasTable('research_notes').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('research_notes', function(t) {
        t.increments('id').primary();
        t.uuid('uuid');
        t.integer('research_document_id').unsigned();
        t.foreign('research_document_id').references('research_documents.id').onDelete('CASCADE');
        t.text('content');
        t.string('note_type', 50); // observation, idea, resource, citation
        t.timestamps(true, true);
      });
    }
  })

  knex.schema.hasTable('research_resources').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('research_resources', function(t) {
        t.increments('id').primary();
        t.uuid('uuid');
        t.integer('research_document_id').unsigned();
        t.foreign('research_document_id').references('research_documents.id').onDelete('CASCADE');
        t.string('title', 255);
        t.string('url', 500);
        t.string('resource_type', 50); // article, book, website, video
        t.text('notes');
        t.timestamps(true, true);
      });
    }
  })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('research_resources')
    .dropTableIfExists('research_notes')
    .dropTableIfExists('research_documents');
};
