import { createServerFn } from "@tanstack/react-start";
import {
  createSession,
  COOKIE_NAME,
  deleteSession,
  getCurrentSession,
} from "../session";
import { SignInSchema, SignUpSchema } from "./schema";
import { createUser, getUser } from "../user";
import { setCookie, deleteCookie } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import {
  UserNotFoundError,
  InvalidPasswordError,
  EmailAlreadyExistsError,
} from "./errors";

export const signIn = createServerFn()
  .inputValidator((data) => SignInSchema.parse(data))
  .handler(async ({ data }) => {
    const user = await getUser({
      data: {
        email: data.email,
      },
    });

    if (!user) throw new UserNotFoundError();

    const passwordMatch = await Bun.password.verify(
      data.password,
      user.password,
    );
    if (!passwordMatch) throw new InvalidPasswordError();

    const session = await createSession({ data: { userId: user.id } });
    setCookie(COOKIE_NAME, session.id);

    redirect({
      to: "/",
    });
  });

export const signUp = createServerFn()
  .inputValidator((data) => SignUpSchema.parse(data))
  .handler(async ({ data }) => {
    const user = await getUser({
      data: {
        email: data.email,
      },
    });

    if (user) throw new EmailAlreadyExistsError();

    const newUser = await createUser({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    const session = await createSession({ data: { userId: newUser.id } });
    setCookie(COOKIE_NAME, session.id);

    redirect({
      to: "/",
    });
  });

export const signOut = createServerFn().handler(async () => {
  const session = await getCurrentSession();

  if (!session) return;

  await deleteSession({
    data: {
      id: session.id,
    },
  });
  deleteCookie(COOKIE_NAME);
});
