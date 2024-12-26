import { createFileRoute, redirect } from "@tanstack/react-router";
import { Type } from "@sinclair/typebox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useAuth } from "@/lib/auth";
import type { Static } from "@sinclair/typebox";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";

const SignInSchema = Type.Object({
  email: Type.String({
    format: "email",
    error: "Invalid email address",
    description: "Enter your email address",
  }),
  password: Type.String({
    minLength: 1,
    error: "Password is required",
    description: "Enter your password",
  }),
});

type SignInFormData = Static<typeof SignInSchema>;

type SearchParams = {
  email?: string;
};

export const Route = createFileRoute("/signin")({
  validateSearch: (search?: SearchParams) => {
    const email = typeof search?.email === "string" ? search?.email : undefined;
    return { email };
  },
  component: SignIn,
});

export function SignIn({}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errormsg, setError] = useState<string | null>(null);
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,

    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    defaultValues: {
      email: email || "",
      password: "",
    },
  });

  const onSubmit = useCallback(async (data: SignInFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const result = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
      });

      if (result.error) {
        console.log(result.error);
        throw new Error(result?.error?.message || "Failed to sign in");
      }

      reset();
      navigate({
        to: "/vehicles",
        search: {
          page: 1,
          pageSize: 10,
          sortField: "yearManufactured",
          sortOrder: "desc",
        },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String(err.message)
            : "An error occurred during sign in";

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className=" max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          {errormsg && (
            <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="text-sm">{errormsg}</p>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isSubmitting}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password">
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-sm font-normal"
                  >
                    Forgot password?
                  </Button>
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                disabled={isSubmitting}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-normal"
              >
                Sign up
              </Button>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
