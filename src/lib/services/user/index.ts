import { createServerFn } from "@tanstack/react-start";
import { CreateUserSchema, UserSchema } from "./schema";
import { db, schema } from "@/lib/db";
import { z } from "zod";
import { eq } from "drizzle-orm";

export class User {
  readonly id: string;
  readonly name: string;
  readonly email: string;

  constructor({
    id,
    name,
    email,
  }: {
    id: string;
    name: string;
    email: string;
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static get = createServerFn({
    method: "GET",
  })
    .inputValidator((data) => {
      const GetUserSchema = z.union([
        UserSchema.pick({ id: true }),
        UserSchema.pick({ email: true }),
      ]);
      return GetUserSchema.parse(data);
    })
    .handler(async ({ data }) => {
      const filter =
        "id" in data
          ? eq(schema.users.id, data.id)
          : eq(schema.users.email, data.email);
      const [user] = await db
        .select()
        .from(schema.users)
        .where(filter)
        .limit(1);

      if (!user) null;

      return new User({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    });

  static create = createServerFn({ method: "POST" })
    .inputValidator((data) => CreateUserSchema.parse(data))
    .handler(async ({ data }) => {
      const [user] = await db
        .insert(schema.users)
        .values({
          name: data.name,
          email: data.email,
          password: data.password,
        })
        .returning();

      return new User({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    });
}
