/*** @param { import("knex").Knex } knex* @returns { Promise<void> }*/ export async function up(
  knex
) {
  await knex.schema.createTable("paciente", (table) => {
    table.increments("id_paciente").primary();
    table.string("nombre", 100).notNullable();
    table.string("apellido", 100).notNullable();
    table.string("email", 150).notNullable().unique();
    table.string("telefono", 20);
    table.string("dni", 20).unique();
    table.timestamp("fecha_creacion").defaultTo(knex.fn.now());
  });
}
export async function down(knex) {
  await knex.schema.dropTableIfExists("paciente");
}
