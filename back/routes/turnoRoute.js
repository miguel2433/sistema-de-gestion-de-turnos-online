import express from "express";
import { turnoController } from "../controller/turnoController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Solo administradores pueden ver todos los turnos
router.get("/", authenticate, authorizeRoles("Administrador"), turnoController.listar);

// Turnos del usuario autenticado (rol Usuario)
router.get(
  "/mis/usuario",
  authenticate,
  authorizeRoles("Usuario"),
  turnoController.misTurnosUsuario
);

// Turnos del profesional autenticado (rol Profesional)
router.get(
  "/mis/profesional",
  authenticate,
  authorizeRoles("Profesional"),
  turnoController.misTurnosProfesional
);

router.get("/:id", authenticate, turnoController.obtener);

// Crear turno: administrador o usuario (el usuario solo puede crear turnos propios)
router.post("/", authenticate, authorizeRoles("Administrador", "Usuario"), turnoController.crear);

// Actualizar datos completos: solo administrador
router.put("/:id", authenticate, authorizeRoles("Administrador"), turnoController.actualizar);

// Eliminar turno: solo administrador
router.delete("/:id", authenticate, authorizeRoles("Administrador"), turnoController.eliminar);

// Cambiar solo el estado del turno (usuario/profesional/admin, con control de propietario en el controller)
router.patch("/:id/estado", authenticate, turnoController.cambiarEstado);

export default router;
