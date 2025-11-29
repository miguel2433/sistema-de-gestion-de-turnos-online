import { turnoRepository } from "../repositories/turnoRepository.js";
import { turnoSchema } from "../models/turno.js";
import { sedeRepository } from "../repositories/sedeRepository.js";
import { especialidadSedeRepository } from "../repositories/especialidadSedeRepository.js";
import { profesionalRepository } from "../repositories/profesionalRepository.js";

const normalizeRole = (rol) => {
  const s = (typeof rol === "string" ? rol : rol?.nombre_rol || "").toLowerCase();
  if (s === "admin" || s === "administrador") return "Administrador";
  if (s === "paciente" || s === "usuario") return "Usuario";
  if (s === "profesional" || s === "médico" || s === "medico" || s === "doctor") return "Profesional";
  return typeof rol === "string" ? rol : rol?.nombre_rol;
};

const obtenerProximaHoraDisponible = (horarioApertura, horarioCierre, turnos) => {
  const toMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.toString().slice(0, 5).split(":");
    return Number(h) * 60 + Number(m || 0);
  };

  const inicio = toMinutes(horarioApertura || "09:00");
  const fin = toMinutes(horarioCierre || "17:00");
  const paso = 30; // minutos por turno

  const ocupadas = new Set(
    turnos.map((t) => (t.hora_turno || "").toString().slice(0, 5))
  );

  for (let minuto = inicio; minuto + paso <= fin; minuto += paso) {
    const h = String(Math.floor(minuto / 60)).padStart(2, "0");
    const m = String(minuto % 60).padStart(2, "0");
    const hhmm = `${h}:${m}`;
    if (!ocupadas.has(hhmm)) {
      return `${hhmm}:00`;
    }
  }
  return null;
};

const esFechaEnPasado = (fechaStr) => {
  if (!fechaStr) return false;
  const hoy = new Date().toISOString().slice(0, 10);
  return fechaStr < hoy;
};

const marcarTurnosNoPresentados = async () => {
  const ahora = new Date();
  const fechaActual = ahora.toISOString().slice(0, 10);
  const horaActual = ahora.toTimeString().slice(0, 8);
  await turnoRepository.marcarNoPresentadosVencidos(fechaActual, horaActual);
};

export const turnoController = {
  async listar(req, res) {
    try {
      await marcarTurnosNoPresentados();
      const data = await turnoRepository.getAll();
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async misTurnosUsuario(req, res) {
    try {
      const idUsuario = req.user?.id_usuario;
      if (!idUsuario) {
        return res.status(401).json({ ok: false, error: "No autenticado" });
      }
      await marcarTurnosNoPresentados();
      const data = await turnoRepository.getByUsuarioId(idUsuario);
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async misTurnosProfesional(req, res) {
    try {
      let idProfesional = req.user?.id_profesional;
      if (!idProfesional) {
        // Resolver por email del usuario autenticado (si el flujo usa un único login de usuario)
        if (!req.user?.email) {
          return res.status(400).json({ ok: false, error: "No se pudo resolver el profesional del usuario" });
        }
        const prof = await profesionalRepository.findByEmail(req.user.email);
        if (!prof) {
          return res.status(404).json({ ok: false, error: "Profesional no encontrado para este usuario" });
        }
        idProfesional = prof.id_profesional;
      }
      await marcarTurnosNoPresentados();
      const data = await turnoRepository.getByProfesionalId(idProfesional);
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async obtener(req, res) {
    try {
      const { id } = req.params;
      const item = await turnoRepository.getById(id);
      if (!item) return res.status(404).json({ ok: false, error: "No encontrado" });
      return res.status(200).json({ ok: true, data: item });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async crear(req, res) {
    try {
      const parse = turnoSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ ok: false, error: parse.error.flatten() });
      }
      const data = parse.data;
      // Normalizar hora de usuario a HH:MM:SS si viene como HH:MM
      if (data.hora_turno && /^\d{2}:\d{2}$/.test(data.hora_turno)) {
        data.hora_turno = `${data.hora_turno}:00`;
      }
      const roleName = normalizeRole(req.user?.rol);
      if (roleName === "Usuario") {
        data.id_usuario = req.user.id_usuario;
      }

      if (roleName === "Administrador" && !data.id_usuario) {
        return res.status(400).json({
          ok: false,
          error: "El usuario es obligatorio para crear un turno desde administración",
        });
      }

      if (esFechaEnPasado(data.fecha_turno)) {
        return res.status(400).json({
          ok: false,
          error: "No se puede crear un turno en una fecha anterior a hoy",
        });
      }

      // Validar que la especialidad esté disponible en la sede
      const especialidadesSede = await especialidadSedeRepository.getEspecialidadesBySede(
        data.id_sede
      );
      const tieneEspecialidadEnSede = especialidadesSede.some(
        (e) => Number(e.id_especialidad) === Number(data.especialidad.id_especialidad)
      );
      if (!tieneEspecialidadEnSede) {
        return res.status(400).json({
          ok: false,
          error: "La especialidad seleccionada no está disponible en la sede elegida",
        });
      }

      // Validar que el profesional tenga esa especialidad
      const profesional = await profesionalRepository.getById(data.id_profesional);
      if (!profesional || Number(profesional.id_especialidad) !== Number(data.especialidad.id_especialidad)) {
        return res.status(400).json({
          ok: false,
          error: "El profesional seleccionado no corresponde a la especialidad elegida",
        });
      }

      // Asignar hora automáticamente si no viene en el body (por ejemplo, usuarios)
      if (!data.hora_turno) {
        const sede = await sedeRepository.getById(data.id_sede);
        if (!sede) {
          return res.status(400).json({ ok: false, error: "Sede no encontrada" });
        }
        const turnosDia = await turnoRepository.getByFechaProfesionalYSede(
          data.fecha_turno,
          data.id_profesional,
          data.id_sede
        );
        const proximaHora = obtenerProximaHoraDisponible(
          sede.horario_apertura,
          sede.horario_cierre,
          turnosDia
        );
        if (!proximaHora) {
          return res.status(400).json({
            ok: false,
            error: "No hay horarios disponibles para la fecha seleccionada",
          });
        }
        data.hora_turno = proximaHora;
      }

      const created = await turnoRepository.create(data);
      return res.status(201).json({ ok: true, data: created });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const parse = turnoSchema.partial().safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ ok: false, error: parse.error.flatten() });
      }
      const exists = await turnoRepository.getById(id);
      if (!exists) return res.status(404).json({ ok: false, error: "No encontrado" });
      const data = parse.data;
      if (data.fecha_turno && esFechaEnPasado(data.fecha_turno)) {
        return res.status(400).json({
          ok: false,
          error: "No se puede reprogramar un turno a una fecha anterior a hoy",
        });
      }
      const updated = await turnoRepository.update(id, data);
      return res.status(200).json({ ok: true, data: updated });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const deleted = await turnoRepository.remove(id);
      if (!deleted) return res.status(404).json({ ok: false, error: "No encontrado" });
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async cambiarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const ALLOWED = [
        "pendiente",
        "confirmado",
        "atendido",
        "cancelado",
        "no_presentado",
      ];
      if (!ALLOWED.includes(estado)) {
        return res.status(400).json({ ok: false, error: "Estado inválido" });
      }

      const turno = await turnoRepository.getById(id);
      if (!turno) {
        return res.status(404).json({ ok: false, error: "No encontrado" });
      }

      const roleName = normalizeRole(req.user?.rol);
      const idUsuario = req.user?.id_usuario;
      let idProfesionalToken = req.user?.id_profesional;
      if (!idProfesionalToken && req.user?.email) {
        const prof = await profesionalRepository.findByEmail(req.user.email);
        idProfesionalToken = prof?.id_profesional;
      }

      if (roleName === "Usuario" && turno.id_usuario !== idUsuario) {
        return res.status(403).json({ ok: false, error: "No autorizado" });
      }

      if (roleName === "Profesional" && (!idProfesionalToken || turno.id_profesional !== idProfesionalToken)) {
        return res.status(403).json({ ok: false, error: "No autorizado" });
      }

      // Administrador puede cambiar cualquier turno

      const updated = await turnoRepository.updateEstado(id, estado);
      return res.status(200).json({ ok: true, data: updated });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
};
