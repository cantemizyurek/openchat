import { z } from "zod";

export const SessionSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  expiresAt: z.date(),
});

export const SessionCreateSchema = SessionSchema.pick({
  userId: true,
});
