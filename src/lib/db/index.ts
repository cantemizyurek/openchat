import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { env } from "@/config/env";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const db = drizzle(env.DATABASE_URL, {
  schema,
});

export { schema };
