// src/modules/auth/auth.routes.ts

import { Router } from "express";
import { RegsiterUser, login } from "./auth.service.js";
import { signToken } from "./auth.utils.js";

const router = Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await RegsiterUser(name, email, password);

    const token = signToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
    });

  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await login(email, password);

    const token = signToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Logged in successfully",
    });

  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;