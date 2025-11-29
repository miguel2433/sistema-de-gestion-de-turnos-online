import express from "express";
import { sedeController } from "../controller/sedeController.js";

const router = express.Router();

router.get("/", sedeController.listar);
router.get("/:id/especialidades", sedeController.especialidadesPorSede);
router.get("/:id", sedeController.obtener);
router.post("/", sedeController.crear);
router.put("/:id", sedeController.actualizar);
router.delete("/:id", sedeController.eliminar);
router.post("/:id/especialidades", sedeController.agregarEspecialidad);
router.delete("/:id/especialidades/:idEspecialidad", sedeController.quitarEspecialidad);

export default router;
