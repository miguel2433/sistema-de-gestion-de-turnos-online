import db from "../db.js";

export const especialidadRepository = {
  async getAll() {
    return db("especialidad").select("*");
  },
  async getById(id) {
    return db("especialidad").where({ id_especialidad: id }).first();
  },
  async create(data) {
    const [id] = await db("especialidad").insert({
      nombre_especialidad: data.nombre_especialidad,
      descripcion: data.descripcion ?? null,
      activa: data.activa ?? true,
    });
    return this.getById(id);
  },
  async getByNombre(nombre) {
    return db("especialidad").where({ nombre_especialidad: nombre }).first();
  },
  async update(id, data) {
    await db("especialidad")
      .where({ id_especialidad: id })
      .update({
        nombre_especialidad: data.nombre_especialidad,
        descripcion: data.descripcion,
        activa: data.activa,
      });
    return this.getById(id);
  },
  async remove(id) {
    return db("especialidad").where({ id_especialidad: id }).del();
  },

};
