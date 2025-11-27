import db from "../db.js";

export const especialidadSedeRepository = {
  async getEspecialidadesBySede(idSede) {
    const rows = await db("especialidad_sede as es")
      .join("especialidad as e", "es.id_especialidad", "e.id_especialidad")
      .where({ "es.id_sede": idSede })
      .select("e.*");
    return rows;
  },
};
