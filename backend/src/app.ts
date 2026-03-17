import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import { requireAuth } from "./modules/auth/auth.middleware.js";
import { prisma } from "./config/prisma.js";

const app = express();
app.use(helmet());
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));
app.use(express.json());

app.use("/auth", authRoutes);

/* TEST ROUTE */


app.get("/me", requireAuth, async (req, res) => {
  const userId = (req as any).userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

export default app;