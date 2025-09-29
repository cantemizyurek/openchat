import { PasswordSchema } from "@/lib/schema";
import { CreateUserSchema } from "../user/schema";

export const SignInSchema = CreateUserSchema.pick({
  email: true,
  password: true,
});

export const SignUpSchema = CreateUserSchema.pick({
  email: true,
  password: true,
  name: true,
})
  .extend({
    confirmPassword: PasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
