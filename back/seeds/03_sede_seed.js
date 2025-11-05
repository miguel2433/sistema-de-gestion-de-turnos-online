/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Elimina datos previos
  await knex("sede").del();

  // Inserta nuevas sedes
  await knex("sede").insert([
    {
      nombre: "Clínica Central San Martín",
      direccion: "Av. Rivadavia 2450, San Martín, Buenos Aires",
      telefono: "1145678901",
      activa: true,
      horario_apertura: "08:00:00",
      horario_cierre: "18:00:00",
    },
    {
      nombre: "Centro Médico Belgrano",
      direccion: "Calle Juramento 1234, Belgrano, CABA",
      telefono: "1134567890",
      activa: true,
      horario_apertura: "09:00:00",
      horario_cierre: "19:00:00",
    },
    {
      nombre: "Policlínico Oeste",
      direccion: "Av. Perón 3560, Morón, Buenos Aires",
      telefono: "1122334455",
      activa: true,
      horario_apertura: "07:30:00",
      horario_cierre: "17:00:00",
    },
  ]);
}
