import { CreateUserSchema } from "../user/schema";

export const SignInSchema = CreateUserSchema.pick({
  email: true,
  password: true,
});

export const SignUpSchema = CreateUserSchema.pick({
  email: true,
  password: true,
  name: true,
});
