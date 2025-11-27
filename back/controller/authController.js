import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { usuarioRepository } from "../repositories/usuarioRepository.js";
import { registerSchema, loginSchema } from "../models/auth.js";
import { profesionalRepository } from "../repositories/profesionalRepository.js";

const signToken = (user, extra = {}) => {
  return jwt.sign(
    {
      id_usuario: user.id_usuario,
      email: user.email,
      rol: user.rol,
      ...extra,
    },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  async register(req, res) {
    try {
      const parse = registerSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ ok: false, error: parse.error.flatten() });
      }
      const data = parse.data;

      const existing = await usuarioRepository.findByEmail(data.email);
      if (existing) {
        return res
          .status(409)
          .json({ ok: false, error: "El email ya está registrado" });
      }
      const existingDni = await usuarioRepository.findByDni(data.dni);
      if (existingDni) {
        return res
          .status(409)
          .json({ ok: false, error: "El DNI ya está registrado" });
      }

      const hashed = await bcrypt.hash(data.password, 10);
      const created = await usuarioRepository.create({ ...data, password: hashed });

      const token = signToken(created);
      res.cookie("token", token, cookieOptions);

      const { password, ...userSafe } = created;
      return res.status(201).json({ ok: true, data: userSafe });
    } catch (error) {
      console.error("Error en authController.register:", error.message);
      return res.status(500).json({ ok: false, error: "Error interno del servidor" });
    }
  },

  async login(req, res) {
    try {
      const parse = loginSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ ok: false, error: parse.error.flatten() });
      }
      const { email, password } = parse.data;

      const user = await usuarioRepository.findByEmail(email);
      if (!user) {
        return res
          .status(401)
          .json({ ok: false, error: "Credenciales inválidas" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res
          .status(401)
          .json({ ok: false, error: "Credenciales inválidas" });
      }

      let extra = {};
      try {
        const prof = await profesionalRepository.findByEmail(user.email);
        if (prof) {
          extra.id_profesional = prof.id_profesional;
        }
      } catch {}
      const token = signToken(user, extra);
      res.cookie("token", token, cookieOptions);

      const { password: _p, ...userSafe } = user;
      return res.status(200).json({ ok: true, data: userSafe });
    } catch (error) {
      console.error("Error en authController.login:", error.message);
      return res.status(500).json({ ok: false, error: "Error interno del servidor" });
    }
  },

  async logout(req, res) {
    try {
      res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
      return res.status(200).json({ ok: true, message: "Sesión cerrada" });
    } catch (error) {
      console.error("Error en authController.logout:", error.message);
      return res.status(500).json({ ok: false, error: "Error interno del servidor" });
    }
  },

  async me(req, res) {
    try {
      const id = req.user?.id_usuario;
      if (!id) {
        return res.status(401).json({ ok: false, error: "No autenticado" });
      }
      const user = await usuarioRepository.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ ok: false, error: "Usuario no encontrado" });
      }
      const { password, ...userSafe } = user;
      return res.status(200).json({ ok: true, data: userSafe });
    } catch (error) {
      console.error("Error en authController.me:", error.message);
      return res.status(500).json({ ok: false, error: "Error interno del servidor" });
    }
  },
};
