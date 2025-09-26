import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
});

const clientEnvSchema = z.object({});

export const serverEnv = envSchema.parse(process.env);
export const clientEnv = clientEnvSchema.parse(import.meta.env);
