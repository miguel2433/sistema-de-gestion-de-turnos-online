/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("profesional", (table) => {
    table
      .integer("id_sede")
      .unsigned()
      .references("id_sede")
      .inTable("sede")
      .onDelete("SET NULL"); // opcional
  });
}

export async function down(knex) {
  await knex.schema.alterTable("profesional", (table) => {
    table.dropColumn("id_sede");
  });
}
