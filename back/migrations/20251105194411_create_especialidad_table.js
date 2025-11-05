/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("especialidad", (table) => {
    table.increments("id_especialidad").primary();
    table.string("nombre_especialidad", 100).notNullable().unique();
    table.text("descripcion");
    table.boolean("activa").defaultTo(true);
    table.timestamp("fecha_creacion").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("especialidad");
}
