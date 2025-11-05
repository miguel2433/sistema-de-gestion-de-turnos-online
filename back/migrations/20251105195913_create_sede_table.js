/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("sede", (table) => {
    table.increments("id_sede").primary();
    table.string("nombre", 100).notNullable();
    table.text("direccion");
    table.string("telefono",20);
    table.boolean("activa").defaultTo(true);
    table.time("horario_apertura");
    table.time("horario_cierre");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("sede");
}
