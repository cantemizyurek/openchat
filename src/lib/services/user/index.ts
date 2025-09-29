import { createServerFn } from "@tanstack/react-start";
import { CreateUserSchema, UserSchema } from "./schema";
import { db, schema } from "@/lib/db";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getCurrentSession } from "../session";
import { hash } from "bcryptjs";

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

export interface UserWithPassword extends User {
  readonly password: string;
}

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<User | null> => {
    const session = await getCurrentSession();
    if (!session) return null;

    const user = await getUser({
      data: { id: session.userId },
    });
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
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
  .handler(async ({ data }): Promise<UserWithPassword | null> => {
    const filter =
      "id" in data
        ? eq(schema.users.id, data.id)
        : eq(schema.users.email, data.email);
    const [user] = await db.select().from(schema.users).where(filter);

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
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
        password: await hash(data.password, 12),
      })
      .returning();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  });
