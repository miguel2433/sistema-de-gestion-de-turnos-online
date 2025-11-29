import db from "../db.js";

export const especialidadSedeRepository = {
  async getEspecialidadesBySede(idSede) {
    const rows = await db("especialidad_sede as es")
      .join("especialidad as e", "es.id_especialidad", "e.id_especialidad")
      .where({ "es.id_sede": idSede })
      .select("e.*");
    return rows;
  },
  async add(idSede, idEspecialidad) {
    const [id] = await db("especialidad_sede").insert({
      id_sede: idSede,
      id_especialidad: idEspecialidad,
    });
    return db("especialidad_sede").where({ id }).first();
  },
  async remove(idSede, idEspecialidad) {
    return db("especialidad_sede")
      .where({ id_sede: idSede, id_especialidad: idEspecialidad })
      .del();
  },
};
