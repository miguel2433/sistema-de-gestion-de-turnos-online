import express from "express";
import { authController } from "../controller/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);

export default router;
