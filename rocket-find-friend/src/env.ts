import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(6),
  PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
