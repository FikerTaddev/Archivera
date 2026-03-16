import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  REMOTE_DATABASE_URL: z.string().url(),
  LOCAL_DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(20),

  APP_URL: z.string().url(),

  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),

  OPENROUTER_API_KEY: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;