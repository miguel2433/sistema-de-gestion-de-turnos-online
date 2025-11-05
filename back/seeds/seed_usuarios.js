/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Borra datos anteriores
  await knex("usuarios").del();

  // Inserta nuevos registros
  await knex("usuarios").insert([
    {
      nombre: "Admin",
      email: "admin@example.com",
      password: "1234",
      activo: true,
    },
    {
      nombre: "Juan Pérez",
      email: "juanperez@example.com",
      password: "abcd",
      activo: true,
    },
    {
      nombre: "María López",
      email: "marialopez@example.com",
      password: "xyz",
      activo: false,
    },
  ]);
}
