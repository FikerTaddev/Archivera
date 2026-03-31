// src/modules/auth/auth.middleware.ts

import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "./auth.utils.ts";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
  const payload = verifyToken(token);

  console.log("TOKEN PAYLOAD:", payload);

  (req as any).userId = payload.userId;

  next();
} catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}