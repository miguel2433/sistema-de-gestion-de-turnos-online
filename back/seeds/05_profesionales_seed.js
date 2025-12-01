import bcrypt from "bcrypt";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Limpiar la tabla
  await knex("profesional").del();

  // Encriptar contraseñas
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Insertar profesionales
  await knex("profesional").insert([
    {
      nombre: "Laura",
      apellido: "Pérez",
      email: "laura.perez@hospital.com",
      telefono: "1123456789",
      matricula: "MAT-1001",
      password: hashedPassword,
      id_rol: 2,
      activo: true,
      id_especialidad: 1, 
      id_sede:3
    },
    {
      nombre: "Martín",
      apellido: "Gómez",
      email: "martin.gomez@hospital.com",
      telefono: "1123987654",
      matricula: "MAT-1002",
      password: hashedPassword,
      id_rol: 2,
      activo: true,
      id_especialidad: 2, // Dermatología
      id_sede:2
    },
    {
      nombre: "Ana",
      apellido: "Torres",
      email: "ana.torres@hospital.com",
      telefono: "1134567890",
      matricula: "MAT-1003",
      password: hashedPassword,
      id_rol: 2,
      activo: true,
      id_especialidad: 3, // Pediatría
      id_sede:1
    },
  ]);
}
