/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("rol", (table) => {
    table.increments("id_rol").primary(); // Clave primaria
    table.string("nombre_rol").notNullable(); // Nombre del rol
    table.text("descripcion").notNullable(); // Descripción del rol
    table.boolean("activo").defaultTo(true); // Estado del rol
    table.timestamp("fecha_creacion").defaultTo(knex.fn.now()); // Fecha de creación del rol
    table.timestamp("fecha_modificacion").nullable(); // Fecha de modificación del rol
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("rol");
}
