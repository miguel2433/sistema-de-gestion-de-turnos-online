/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("usuario_sistema", (table) => {
    table.increments("id_usuario").primary(); // Clave primaria
    table.timestamp("fecha_creacion").defaultTo(knex.fn.now()); // Fecha de creación de la cuenta
    table.timestamp("ultimo_login").nullable(); 
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("usuario_sistema");
}
