/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Primero limpiamos la tabla
  await knex("paciente").del();

  // Insertamos datos de ejemplo
  await knex("paciente").insert([
    {
      nombre: "Laura",
      apellido: "Pérez",
      email: "laura.perez@gmail.com",
      telefono: "1123456789",
      dni: "12345678",
    },
    {
      nombre: "Martín",
      apellido: "Gómez",
      email: "martin.gomez@gmail.com",
      telefono: "1123987654",
      dni: "23456789",
    },
    {
      nombre: "Ana",
      apellido: "Torres",
      email: "ana.torres@gmail.com",
      telefono: "1134567890",
      dni: "34567890",
    },
  ]);
}
