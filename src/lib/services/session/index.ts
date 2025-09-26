import { createServerFn } from "@tanstack/react-start";
import { SessionSchema, SessionCreateSchema } from "./schema";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getCookies } from "@tanstack/react-start/server";

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

export const createSession = createServerFn({
  method: "POST",
})
  .inputValidator((data) => SessionCreateSchema.parse(data))
  .handler(async ({ data }): Promise<Session> => {
    const session = await db.insert(schema.sessions).values({
      userId: data.userId,
    });

    return session;
  });

export const getCurrentSession = createServerFn({
  method: "GET",
}).handler(async (): Promise<Session | null> => {
  const sessionId = getCookies()["session"];

  if (!sessionId) return null;

  const session = await getSession({
    data: {
      id: sessionId,
    },
  });

  return session;
});

export const getSession = createServerFn({
  method: "GET",
})
  .inputValidator((data) => SessionSchema.pick({ id: true }).parse(data))
  .handler(async ({ data }): Promise<Session | null> => {
    const [session] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.id, data.id))
      .limit(1);

    if (!session) return null;

    if (session.expiresAt < new Date()) {
      await db
        .delete(schema.sessions)
        .where(eq(schema.sessions.id, session.id));
      return null;
    }

    return session;
  });
