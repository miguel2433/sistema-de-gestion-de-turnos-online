import express from "express";
import { profesionalController } from "../controller/profesionalController.js";

const router = express.Router();

router.get("/", profesionalController.listar);
router.get("/:id", profesionalController.obtener);
router.post("/", profesionalController.crear);
router.put("/:id", profesionalController.actualizar);
router.delete("/:id", profesionalController.eliminar);

export default router;
