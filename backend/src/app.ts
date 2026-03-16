import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import { requireAuth } from "./modules/auth/auth.middleware.js";


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
  res.json({ userId: (req as any).userId });
});

export default app;