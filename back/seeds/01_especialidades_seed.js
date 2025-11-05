/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Eliminar datos existentes
  await knex("especialidad").del();

  // Insertar nuevas especialidades
  await knex("especialidad").insert([
    {
      nombre_especialidad: "Cardiología",
      descripcion:
        "Especialidad dedicada al diagnóstico y tratamiento de enfermedades del corazón.",
      activa: true,
    },
    {
      nombre_especialidad: "Dermatología",
      descripcion: "Estudia las enfermedades de la piel, cabello y uñas.",
      activa: true,
    },
    {
      nombre_especialidad: "Pediatría",
      descripcion: "Atiende la salud y desarrollo de niños y adolescentes.",
      activa: true,
    },
    {
      nombre_especialidad: "Traumatología",
      descripcion: "Tratamiento de lesiones del sistema musculoesquelético.",
      activa: true,
    },
  ]);
}
