/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("usuario", (table) => {
    table.increments("id_usuario").primary();
    table.string("nombre", 100).notNullable();
    table.string("email", 150).notNullable().unique();
    table.string("password", 255).notNullable();
    table.boolean("activo").defaultTo(true);
    table.timestamp("fecha_creacion").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("usuario");
}

