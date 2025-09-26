import { createServerFn } from "@tanstack/react-start";
import { CreateUserSchema, UserSchema } from "./schema";
import { db, schema } from "@/lib/db";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getCookies } from "@tanstack/react-start/server";

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

export const currentUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<User | null> => {
    const cookies = getCookies();
    const session = cookies.session;

    if (!session) return null;

    const [res] = await db
      .select({
        user: schema.users,
      })
      .from(schema.users)
      .innerJoin(schema.sessions, eq(schema.users.id, schema.sessions.userId))
      .where(eq(schema.sessions.id, session))
      .limit(1);

    if (!res) return null;

    return {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
    };
  },
);

export const getUser = createServerFn({
  method: "GET",
})
  .inputValidator((data) => {
    const GetUserSchema = z.union([
      UserSchema.pick({ id: true }),
      UserSchema.pick({ email: true }),
    ]);
    return GetUserSchema.parse(data);
  })
  .handler(async ({ data }): Promise<User | null> => {
    const filter =
      "id" in data
        ? eq(schema.users.id, data.id)
        : eq(schema.users.email, data.email);
    const [user] = await db.select().from(schema.users).where(filter).limit(1);

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  });

export const createUser = createServerFn({ method: "POST" })
  .inputValidator((data) => CreateUserSchema.parse(data))
  .handler(async ({ data }): Promise<User> => {
    const [user] = await db
      .insert(schema.users)
      .values({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      .returning();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  });
