
import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register); // публічний
router.post("/login", login);       // публічний
router.post("/logout", authMiddleware, logout); // приватний

export default router;