import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/services/auth/schema";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import { signIn } from "@/lib/services/auth";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignIn,
});

function SignIn() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Form {...form}>
        <form
          className="flex flex-col gap-6 max-w-sm w-full"
          onSubmit={form.handleSubmit(async (data) => {
            await signIn({ data });
            router.navigate({ to: "/" });
          })}
        >
          <div className="flex flex-col gap-2 text-center items-center">
            <FlaskConical className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold">Welcome to Prompt Chat</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/auth/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="can@temizyurek.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!form.formState.isValid}>
              Sign In
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
