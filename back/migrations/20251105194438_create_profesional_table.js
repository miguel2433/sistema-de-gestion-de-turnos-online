/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("profesional", (table) => {
    table.increments("id_profesional").primary();
    table.string("nombre", 100).notNullable();
    table.string("apellido", 100).notNullable();
    table.string("email", 100).notNullable().unique();
    table.string("telefono", 20);
    table.string("matricula", 50).notNullable().unique();
    table.string("password", 255).notNullable();
    table.boolean("activo").defaultTo(true);
    table.timestamp("fecha_creacion").defaultTo(knex.fn.now());

    // Clave foránea hacia especialidades
    table
      .integer("id_especialidad")
      .unsigned()
      .notNullable()
      .references("id_especialidad")
      .inTable("especialidad")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("profesional");
}
