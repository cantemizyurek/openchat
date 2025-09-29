import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/lib/services/auth/schema";
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
import { signUp } from "@/lib/services/auth";

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUp,
});

function SignUp() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Form {...form}>
        <form
          className="flex flex-col gap-6 max-w-sm w-full"
          onSubmit={form.handleSubmit(async (data) => {
            await signUp({
              data,
            });
            router.navigate({
              to: "/",
            });
          })}
        >
          <div className="flex flex-col gap-2 text-center items-center">
            <FlaskConical className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold">Welcome to Prompt Chat</h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/auth/sign-in" className="underline underline-offset-4">
                Sign in
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="can" {...field} />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!form.formState.isValid}>
              Sign Up
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
