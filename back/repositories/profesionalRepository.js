import db from "../db.js";

export const profesionalRepository = {
  async getAll() {
    const rows = await db("profesional as p")
      .leftJoin("rol as r", "p.id_rol", "r.id_rol")
      .select(
        "p.*",
        "r.id_rol as r_id_rol",
        "r.nombre_rol as r_nombre_rol",
        "r.descripcion as r_descripcion"
      );
    return rows.map((row) => ({
      ...row,
      rol: row.r_id_rol
        ? {
            id_rol: row.r_id_rol,
            nombre_rol: row.r_nombre_rol,
            descripcion: row.r_descripcion,
          }
        : null,
    }));
  },
  async getById(id) {
    const row = await db("profesional as p")
      .leftJoin("rol as r", "p.id_rol", "r.id_rol")
      .where({ "p.id_profesional": id })
      .select(
        "p.*",
        "r.id_rol as r_id_rol",
        "r.nombre_rol as r_nombre_rol",
        "r.descripcion as r_descripcion"
      )
      .first();
    if (!row) return null;
    return {
      ...row,
      rol: row.r_id_rol
        ? {
            id_rol: row.r_id_rol,
            nombre_rol: row.r_nombre_rol,
            descripcion: row.r_descripcion,
          }
        : null,
    };
  },
  async findByEmail(email) {
    const row = await db("profesional as p")
      .leftJoin("rol as r", "p.id_rol", "r.id_rol")
      .where({ "p.email": email })
      .select(
        "p.*",
        "r.id_rol as r_id_rol",
        "r.nombre_rol as r_nombre_rol",
        "r.descripcion as r_descripcion"
      )
      .first();
    if (!row) return null;
    return {
      ...row,
      rol: row.r_id_rol
        ? {
            id_rol: row.r_id_rol,
            nombre_rol: row.r_nombre_rol,
            descripcion: row.r_descripcion,
          }
        : null,
    };
  },
  async create(data) {
    let idRol = data.rol?.id_rol;
    if (!idRol) {
      const rolProfesional = await db("rol")
        .where({ nombre_rol: "Profesional" })
        .first();
      idRol = rolProfesional?.id_rol ?? null;
    }

    const [id] = await db("profesional").insert({
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono ?? null,
      matricula: data.matricula,
      password: data.password,
      activo: data.activo ?? true,
      id_especialidad: data.id_especialidad,
      id_rol: idRol,
    });
    return this.getById(id);
  },
  async update(id, data) {
    await db("profesional")
      .where({ id_profesional: id })
      .update({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        matricula: data.matricula,
        password: data.password,
        activo: data.activo,
        id_especialidad: data.id_especialidad,
        id_rol: data.rol?.id_rol ?? undefined,
      });
    return this.getById(id);
  },
  async remove(id) {
    return db("profesional").where({ id_profesional: id }).del();
  },
};
