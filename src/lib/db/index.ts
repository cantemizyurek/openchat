import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";
import { serverEnv } from "@/config/env";

export const db = drizzle(serverEnv.DATABASE_URL, {
  schema,
  casing: "snake_case",
});

export { schema };
