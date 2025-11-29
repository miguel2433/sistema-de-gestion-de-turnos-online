import db from "../db.js";

export const turnoRepository = {
  async getAll() {
    const rows = await db("turno as t")
      .leftJoin("especialidad as e", "t.id_especialidad", "e.id_especialidad")
      .select(
        "t.*",
        "e.id_especialidad as e_id_especialidad",
        "e.nombre_especialidad as e_nombre_especialidad",
        "e.descripcion as e_descripcion",
        "e.activa as e_activa"
      );
    return rows.map((row) => ({
      ...row,
      especialidad: row.e_id_especialidad
        ? {
            id_especialidad: row.e_id_especialidad,
            nombre_especialidad: row.e_nombre_especialidad,
            descripcion: row.e_descripcion,
            activa: row.e_activa,
          }
        : null,
    }));
  },
  async getByUsuarioId(idUsuario) {
    const rows = await db("turno as t")
      .leftJoin("especialidad as e", "t.id_especialidad", "e.id_especialidad")
      .where({ "t.id_usuario": idUsuario })
      .select(
        "t.*",
        "e.id_especialidad as e_id_especialidad",
        "e.nombre_especialidad as e_nombre_especialidad",
        "e.descripcion as e_descripcion",
        "e.activa as e_activa"
      );
    return rows.map((row) => ({
      ...row,
      especialidad: row.e_id_especialidad
        ? {
            id_especialidad: row.e_id_especialidad,
            nombre_especialidad: row.e_nombre_especialidad,
            descripcion: row.e_descripcion,
            activa: row.e_activa,
          }
        : null,
    }));
  },
  async getByProfesionalId(idProfesional) {
    const rows = await db("turno as t")
      .leftJoin("especialidad as e", "t.id_especialidad", "e.id_especialidad")
      .where({ "t.id_profesional": idProfesional })
      .select(
        "t.*",
        "e.id_especialidad as e_id_especialidad",
        "e.nombre_especialidad as e_nombre_especialidad",
        "e.descripcion as e_descripcion",
        "e.activa as e_activa"
      );
    return rows.map((row) => ({
      ...row,
      especialidad: row.e_id_especialidad
        ? {
            id_especialidad: row.e_id_especialidad,
            nombre_especialidad: row.e_nombre_especialidad,
            descripcion: row.e_descripcion,
            activa: row.e_activa,
          }
        : null,
    }));
  },
  async getById(id) {
    const row = await db("turno as t")
      .leftJoin("especialidad as e", "t.id_especialidad", "e.id_especialidad")
      .where({ "t.id_turno": id })
      .select(
        "t.*",
        "e.id_especialidad as e_id_especialidad",
        "e.nombre_especialidad as e_nombre_especialidad",
        "e.descripcion as e_descripcion",
        "e.activa as e_activa"
      )
      .first();
    if (!row) return null;
    return {
      ...row,
      especialidad: row.e_id_especialidad
        ? {
            id_especialidad: row.e_id_especialidad,
            nombre_especialidad: row.e_nombre_especialidad,
            descripcion: row.e_descripcion,
            activa: row.e_activa,
          }
        : null,
    };
  },
  async create(data) {
    const [id] = await db("turno").insert({
      fecha_turno: data.fecha_turno,
      hora_turno: data.hora_turno,
      estado: data.estado ?? "pendiente",
      motivo_consulta: data.motivo_consulta ?? null,
      observaciones: data.observaciones ?? null,
      id_especialidad: data.especialidad?.id_especialidad,
      id_profesional: data.id_profesional,
      id_sede: data.id_sede,
      id_usuario: data.id_usuario,
    });
    return this.getById(id);
  },
  async update(id, data) {
    await db("turno")
      .where({ id_turno: id })
      .update({
        fecha_turno: data.fecha_turno,
        hora_turno: data.hora_turno,
        estado: data.estado,
        motivo_consulta: data.motivo_consulta,
        observaciones: data.observaciones,
        id_especialidad: data.especialidad?.id_especialidad ?? undefined,
        id_profesional: data.id_profesional,
        id_sede: data.id_sede,
        id_usuario: data.id_usuario,
      });
    return this.getById(id);
  },
  async getByFechaProfesionalYSede(fecha, idProfesional, idSede) {
    return db("turno")
      .where({
        fecha_turno: fecha,
        id_profesional: idProfesional,
        id_sede: idSede,
      })
      .orderBy("hora_turno", "asc");
  },
  async marcarNoPresentadosVencidos(fechaActual, horaActual) {
    await db("turno")
      .whereIn("estado", ["pendiente", "confirmado"])
      .andWhere((qb) => {
        qb.where("fecha_turno", "<", fechaActual).orWhere((qb2) => {
          qb2
            .where("fecha_turno", "=", fechaActual)
            .andWhere("hora_turno", "<", horaActual);
        });
      })
      .update({ estado: "no_presentado" });
  },
  async remove(id) {
    return db("turno").where({ id_turno: id }).del();
  },
  async updateEstado(id, estado) {
    await db("turno")
      .where({ id_turno: id })
      .update({ estado });
    return this.getById(id);
  },
};
