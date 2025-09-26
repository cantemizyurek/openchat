import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { duration } from "@/lib/utils/duration";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  ...timestamps,
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  ...timestamps,
  expiresAt: timestamp("expires_at")
    .notNull()
    .$defaultFn(() => new Date(Date.now() + duration("30d"))),
});
