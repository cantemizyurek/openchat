import { z } from "zod";

export const NameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .max(100, "Name must be at most 100 characters long");

export const EmailSchema = z.email("Invalid email address");

export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(32, "Password must be at most 32 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
  );
