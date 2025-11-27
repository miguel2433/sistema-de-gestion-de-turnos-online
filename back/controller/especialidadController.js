import { especialidadRepository } from "../repositories/especialidadRepository.js";
import { especialidadSchema } from "../models/especialidad.js";

export const especialidadController = {
  async listar(req, res) {
    try {
      const data = await especialidadRepository.getAll();
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async obtener(req, res) {
    try {
      const { id } = req.params;
      const item = await especialidadRepository.getById(id);
      if (!item) return res.status(404).json({ ok: false, error: "No encontrado" });
      return res.status(200).json({ ok: true, data: item });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async crear(req, res) {
    try {
      const parse = especialidadSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ ok: false, error: parse.error.flatten() });
      }
      const exists = await especialidadRepository.getByNombre(parse.data.nombre_especialidad);
      if (exists) return res.status(409).json({ ok: false, error: "Ya existe una especialidad con ese nombre" });
      const created = await especialidadRepository.create(parse.data);
      return res.status(201).json({ ok: true, data: created });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const parse = especialidadSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ ok: false, error: parse.error.flatten() });
      }
      const name_exists = await especialidadRepository.getByNombre(parse.data.nombre_especialidad);
      if (name_exists) return res.status(409).json({ ok: false, error: "Ya existe una especialidad con el nombre:" + parse.data.nombre_especialidad });
      const exists = await especialidadRepository.getById(id);
      if (!exists) return res.status(404).json({ ok: false, error: "No encontrado" });
      const updated = await especialidadRepository.update(id, parse.data);
      return res.status(200).json({ ok: true, data: updated });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const deleted = await especialidadRepository.remove(id);
      if (!deleted) return res.status(404).json({ ok: false, error: "No encontrado" });
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
};
