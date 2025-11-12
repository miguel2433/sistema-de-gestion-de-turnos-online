import { usuarioRepository } from "../repositories/usuarioRepository.js";

export const usuarioController = {
  async listar(req, res) {
    try {
      const usuarios = await usuarioRepository.getAll();

      return res.status(200).json({
        ok: true,
        data: usuarios,
      });
    } catch (error) {
      console.error("Error en usuarioController.listar:", error.message);

      return res.status(404).json({
        ok: false,
        error: error.message,
      });
    }
  },

  async getUserByEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          ok: false,
          error: "El email es obligatorio",
        });
      }

      const usuario = await usuarioRepository.getUserByEmail(email);

      return res.status(200).json({
        ok: true,
        data: usuario,
      });
    } catch (error) {
      console.error(
        "Error en usuarioController.getUserByEmail:",
        error.message
      );

      // Manejo diferenciado según el tipo de error
      if (error.message.includes("No existe un usuario")) {
        return res.status(404).json({
          ok: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        ok: false,
        error: "Error interno del servidor",
      });
    }
  },
};
