import { usuarioController } from "../controller/usuarioController.js";
import express from "express";


const router = express.Router();

router.get("/", usuarioController.listar)
router.post("/email", usuarioController.getUserByEmail)

export default router