/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Limpia la tabla antes de insertar
  await knex("reporte").del();

  // Inserta reportes de ejemplo
  await knex("reporte").insert([
    {
      id_reporte: 1,
      nombre: "Reporte de turnos semanales",
      tipo: "turnos",
      generado_por: "admin",
      fecha_inicio: "2025-11-01",
      fecha_fin: "2025-11-07",
    },
    {
      id_reporte: 2,
      nombre: "Reporte de pacientes activos",
      tipo: "pacientes",
      generado_por: "recepcion",
      fecha_inicio: "2025-10-01",
      fecha_fin: "2025-10-31",
    },
  ]);
}
