/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("usuario", (table) => {
    table.dropColumn("rol");
    table.integer("id_rol").unsigned().references("id_rol").inTable("rol");
  });
}

export async function down(knex) {
    await knex.schema.alterTable("usuario", (table) => {
      table.dropColumn("id_rol");
    });
}
