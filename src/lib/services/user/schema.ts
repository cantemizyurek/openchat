import { PasswordSchema, EmailSchema, NameSchema } from "@/lib/schema";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  name: NameSchema,
  email: EmailSchema,
});

export const CreateUserSchema = UserSchema.omit({ id: true }).extend({
  password: PasswordSchema,
});
