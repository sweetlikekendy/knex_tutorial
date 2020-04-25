exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("first_name");
      table.string("last_name");
      table.string("email");
      table.string("password");
      table.datetime("created_at");
    }),
    knex.schema.createTable("todolists", (table) => {
      table.increments("id").primary();
      table.string("title");
      table.datetime("created_at");
      table.integer("user_id").unsigned().references("users.id");
    }),
  ]);
};
exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable("todolists"),
    knex.schema.dropTable("users"),
  ]);
};
