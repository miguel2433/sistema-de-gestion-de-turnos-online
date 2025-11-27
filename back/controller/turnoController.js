import { turnoRepository } from "../repositories/turnoRepository.js";
import { turnoSchema } from "../models/turno.js";

export const turnoController = {
  async listar(req, res) {
    try {
      const data = await turnoRepository.getAll();
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
      const created = await turnoRepository.create(parse.data);
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
      const updated = await turnoRepository.update(id, parse.data);
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
};
