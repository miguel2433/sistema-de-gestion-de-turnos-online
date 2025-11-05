/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Limpia la tabla antes de insertar
  await knex("especialidad_sede").del();

  // Inserta combinaciones de sede y especialidad
  await knex("especialidad_sede").insert([
    { id_sede: 1, id_especialidad: 1 },
    { id_sede: 1, id_especialidad: 2 },
    { id_sede: 2, id_especialidad: 1 },
    { id_sede: 2, id_especialidad: 3 },
    { id_sede: 3, id_especialidad: 2 },
    { id_sede: 3, id_especialidad: 3 },
  ]);
}
