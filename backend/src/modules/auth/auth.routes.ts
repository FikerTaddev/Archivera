// src/modules/auth/auth.routes.ts

import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  registerController,
  loginController,
  logoutController
} from "./auth.controller.ts";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});


const router = Router();

/* REGISTER */
router.post("/register", registerController);

/* LOGIN */
router.post("/login", loginLimiter, loginController);
/*LOGOUT*/
router.post("/logout", logoutController);

export default router;