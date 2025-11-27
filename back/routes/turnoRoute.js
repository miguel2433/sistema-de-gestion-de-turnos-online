import express from "express";
import { turnoController } from "../controller/turnoController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, turnoController.listar);
router.get("/:id", authenticate, turnoController.obtener);
router.post("/", authenticate, turnoController.crear);
router.put("/:id", authenticate, turnoController.actualizar);
router.delete("/:id", authenticate, turnoController.eliminar);

export default router;
