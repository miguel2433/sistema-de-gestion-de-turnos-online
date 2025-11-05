import bcrypt from "bcrypt";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Primero limpiamos la tabla
  await knex("usuario").del();
  const hashedPassword = await bcrypt.hash("123456", 10);
  // Insertamos datos de ejemplo
  await knex("usuario").insert([
    {
      nombre: "Laura",
      apellido: "Pérez",
      email: "laura.perez@gmail.com",
      password: hashedPassword,
      telefono: "1123456789",
      dni: "12345678",
    },
    {
      nombre: "Martín",
      apellido: "Gómez",
      email: "martin.gomez@gmail.com",
      rol: "admin",
      password: hashedPassword,
      telefono: "1123987654",
      dni: "23456789",
    },
    {
      nombre: "Ana",
      apellido: "Torres",
      email: "ana.torres@gmail.com",
      password: hashedPassword,
      telefono: "1134567890",
      dni: "34567890",
    },
  ]);
}
