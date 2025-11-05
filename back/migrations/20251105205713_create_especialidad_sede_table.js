/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("especialidad_sede", (table) => {
    table.increments("id").primary(); // ID propio opcional
    table
      .integer("id_sede")
      .unsigned()
      .notNullable()
      .references("id_sede")
      .inTable("sede")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table
      .integer("id_especialidad")
      .unsigned()
      .notNullable()
      .references("id_especialidad")
      .inTable("especialidad")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table.timestamp("fecha_creacion").defaultTo(knex.fn.now());

    // Evitar duplicados de sede-especialidad
    table.unique(["id_sede", "id_especialidad"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("especialidad_sede");
}
