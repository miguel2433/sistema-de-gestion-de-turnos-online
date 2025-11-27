import db from "../db.js";

export const sedeRepository = {
  async getAll() {
    return db("sede").select("*");
  },
  async getById(id) {
    return db("sede").where({ id_sede: id }).first();
  },
  async create(data) {
    const [id] = await db("sede").insert({
      nombre: data.nombre,
      direccion: data.direccion ?? null,
      telefono: data.telefono ?? null,
      activa: data.activa ?? true,
      horario_apertura: data.horario_apertura ?? null,
      horario_cierre: data.horario_cierre ?? null,
    });
    return this.getById(id);
  },
  async update(id, data) {
    await db("sede")
      .where({ id_sede: id })
      .update({
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono,
        activa: data.activa,
        horario_apertura: data.horario_apertura,
        horario_cierre: data.horario_cierre,
      });
    return this.getById(id);
  },
  async remove(id) {
    return db("sede").where({ id_sede: id }).del();
  },
};
