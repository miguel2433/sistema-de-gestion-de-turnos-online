import express from "express";
import { especialidadController } from "../controller/especialidadController.js";

const router = express.Router();

router.get("/", especialidadController.listar);
router.get("/:id", especialidadController.obtener);
router.post("/", especialidadController.crear);
router.put("/:id", especialidadController.actualizar);
router.delete("/:id", especialidadController.eliminar);

export default router;
