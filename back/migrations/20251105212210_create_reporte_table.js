/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("reporte", (table) => {
    table.increments("id_reporte").primary();
    table.string("nombre", 100).notNullable();
    table.string("tipo", 50).notNullable();
    table.timestamp("fecha_generacion").defaultTo(knex.fn.now());
    table.string("generado_por", 100);
    table.date("fecha_inicio");
    table.date("fecha_fin");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("reporte");
}
