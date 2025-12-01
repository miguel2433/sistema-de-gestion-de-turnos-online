import bcrypt from "bcrypt";
import { profesionalRepository } from "../repositories/profesionalRepository.js";
import { profesionalSchema } from "../models/profesional.js";

export const profesionalController = {
  async listar(req, res) {
    try {
      const profesionales = await profesionalRepository.getAll();
      const data = profesionales.map((p) => {
        const { password, ...rest } = p;
        const parsed = profesionalSchema.omit({ password: true }).safeParse(rest);
        return parsed.success ? parsed.data : rest;
      });
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async listarPorEspecialidad(req, res) {
    try {
      const { id } = req.params;
      const profesionales = await profesionalRepository.getByEspecialidad(id);
      const data = profesionales.map((p) => {
        const { password, ...rest } = p;
        const parsed = profesionalSchema.omit({ password: true }).safeParse(rest);
        return parsed.success ? parsed.data : rest;
      });
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async listarPorEspecialidadEnSede(req, res) {
    try {
      const { idSede, idEspecialidad } = req.params;
      const profesionales = await profesionalRepository.getByEspecialidadEnSede(
        idSede,
        idEspecialidad
      );
      const data = profesionales.map((p) => {
        const { password, ...rest } = p;
        const parsed = profesionalSchema.omit({ password: true }).safeParse(rest);
        return parsed.success ? parsed.data : rest;
      });
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async obtener(req, res) {
    try {
      const { id } = req.params;
      const item = await profesionalRepository.getById(id);
      if (!item) return res.status(404).json({ ok: false, error: "No encontrado" });
      const { password, ...rest } = item;
      const parsed = profesionalSchema.omit({ password: true }).safeParse(rest);
      const data = parsed.success ? parsed.data : rest;
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async crear(req, res) {
    try {
      const parse = profesionalSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ ok: false, error: parse.error.flatten() });
      }
      const body = parse.data;
      const hashed = await bcrypt.hash(body.password, 10);
      const created = await profesionalRepository.create({ ...body, password: hashed });
      const { password, ...rest } = created;
      const parsed = profesionalSchema.omit({ password: true }).safeParse(rest);
      const data = parsed.success ? parsed.data : rest;
      return res.status(201).json({ ok: true, data });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const parse = profesionalSchema.partial().safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ ok: false, error: parse.error.flatten() });
      }
      const exists = await profesionalRepository.getById(id);
      if (!exists) return res.status(404).json({ ok: false, error: "No encontrado" });
      const body = parse.data;
      if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
      }
      const updated = await profesionalRepository.update(id, body);
      const { password, ...rest } = updated;
      const parsed = profesionalSchema.omit({ password: true }).safeParse(rest);
      const data = parsed.success ? parsed.data : rest;
      return res.status(200).json({ ok: true, data });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const deleted = await profesionalRepository.remove(id);
      if (!deleted) return res.status(404).json({ ok: false, error: "No encontrado" });
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  },
  async listarPorEspecialidadSede(req,res){
    
  }
};
