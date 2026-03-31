import jwt from "jsonwebtoken";
import { env } from "../../config/env.ts";

const secretKey = env.JWT_SECRET;

export function signToken(userId: string) {
  return jwt.sign(
    { userId },          // ONLY minimal payload
    secretKey,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, secretKey) as { userId: string };
}