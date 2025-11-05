/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("turno", (table) => {
    table.increments("id_turno").primary();

    // Fecha y hora del turno
    table.date("fecha_turno").notNullable();
    table.time("hora_turno").notNullable();

    // Estado del turno
    table
      .enum("estado", [
        "pendiente",
        "confirmado",
        "atendido",
        "cancelado",
        "no_presentado",
      ])
      .defaultTo("pendiente");

    table.text("motivo_consulta");
    table.text("observaciones");

    // Timestamps
    table.timestamp("fecha_creacion").defaultTo(knex.fn.now());
    table
      .timestamp("fecha_actualizacion")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    // Claves foráneas
    table
      .integer("id_especialidad")
      .unsigned()
      .notNullable()
      .references("id_especialidad")
      .inTable("especialidad")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table
      .integer("id_profesional")
      .unsigned()
      .notNullable()
      .references("id_profesional")
      .inTable("profesional")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table
      .integer("id_sede")
      .unsigned()
      .notNullable()
      .references("id_sede")
      .inTable("sede")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table
      .integer("id_paciente")
      .unsigned()
      .notNullable()
      .references("id_paciente")
      .inTable("paciente")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("turno");
}
