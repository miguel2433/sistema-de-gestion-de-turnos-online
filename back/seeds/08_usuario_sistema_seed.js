/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Limpia la tabla antes de insertar
  await knex("usuario_sistema").del();

  // Inserta usuarios de ejemplo
  await knex("usuario_sistema").insert([
    {
      id_usuario: 1,
      fecha_creacion: knex.fn.now(),
      ultimo_login: null,
    },
    {
      id_usuario: 2,
      fecha_creacion: knex.fn.now(),
      ultimo_login: null,
    },
    {
      id_usuario: 3,
      fecha_creacion: knex.fn.now(),
      ultimo_login: null,
    },
    {
      id_usuario: 4,
      fecha_creacion: knex.fn.now(),
      ultimo_login: null,
    },
  ]);
}
