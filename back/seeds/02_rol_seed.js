/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Elimina datos previos
  await knex("rol").del();

  // Inserta nuevas sedes
  await knex("rol").insert([
    {
      nombre_rol: "Administrador",
      descripcion: "Rol de administrador",
      activo: true,
      fecha_creacion: knex.fn.now(),
      fecha_modificacion: knex.fn.now(),
    },
    {
      nombre_rol: "Profesional",
      descripcion: "Rol de profesional",
      activo: true,
      fecha_creacion: knex.fn.now(),
      fecha_modificacion: knex.fn.now(),
    },
    {
      nombre_rol: "Usuario",
      descripcion: "Rol de usuario",
      activo: true,
      fecha_creacion: knex.fn.now(),
      fecha_modificacion: knex.fn.now(),
    },
  ]);
}
