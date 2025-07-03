"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/_components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@app/_components/ui/form";
import { Input } from "@app/_components/ui/input";
import { authClient } from "@app/_lib/auth-client";

const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<"valid" | "invalid" | "checking">("checking");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setTokenStatus("invalid");
    } else {
      setTokenStatus("valid");
    }
  }, [searchParams]);

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    setLoading(true);

    const token = searchParams.get("token");

    if (!token) {
      setTokenStatus("invalid");
      setLoading(false);
      return;
    }

    await authClient.resetPassword(
      {
        newPassword: values.password,
        token,
      },
      {
        onResponse: () => {
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          toast.success("Your password has been reset successfully!");
          router.push("/signin");
        },
        onError: (ctx) => {
          toast.error(
            `Error: ${ctx.error.message} (Status: ${ctx.error.status}, Code: ${ctx.error.code})`
          );
        },
      }
    );
  };

  if (tokenStatus === "checking") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Checking the reset password link.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Invalid Link</CardTitle>
          <CardDescription>
            The password reset link is invalid or has expired. Please request a new one.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <p className="text-muted-foreground w-full text-center text-sm">
            <Link
              href="/forgot-password"
              className="hover:text-primary underline underline-offset-4"
            >
              Request a new password reset link
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={loading}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
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
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={loading}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit" className="w-full">
              {loading ? "Resetting password..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-sm">
          Remember your password?{" "}
          <Link href="/signin" className="hover:text-primary underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
