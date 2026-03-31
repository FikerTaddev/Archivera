import {env} from "./env.ts"
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: env.REMOTE_DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });