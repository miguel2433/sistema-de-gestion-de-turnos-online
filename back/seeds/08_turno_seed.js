/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Limpiamos la tabla primero
  await knex("turno").del();

  // Insertamos turnos de ejemplo
  await knex("turno").insert([
    {
      id_usuario: 1, // Laura Pérez
      id_profesional: 1, // Profesional existente
      id_sede: 1, // Sede existente
      id_especialidad: 1, // Especialidad existente
      fecha_turno: "2025-11-10",
      hora_turno: "10:00:00",
      estado: "pendiente",
      motivo_consulta: "Chequeo general",
      observaciones: "Paciente primer turno",
    },
    {
      id_usuario: 2, // Martín Gómez
      id_profesional: 2,
      id_sede: 1,
      id_especialidad: 2,
      fecha_turno: "2025-11-11",
      hora_turno: "11:30:00",
      estado: "confirmado",
      motivo_consulta: "Control de especialidad",
      observaciones: "",
    },
    {
      id_usuario: 3, // Ana Torres
      id_profesional: 3,
      id_sede: 2,
      id_especialidad: 3,
      fecha_turno: "2025-11-12",
      hora_turno: "09:15:00",
      estado: "pendiente",
      motivo_consulta: "Consulta inicial",
      observaciones: "",
    },
  ]);
}
