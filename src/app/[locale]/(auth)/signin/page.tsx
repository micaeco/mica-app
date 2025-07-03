"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useLocale } from "next-intl";
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
import { Separator } from "@app/_components/ui/separator";
import { redirect } from "@app/_i18n/routing";
import { authClient } from "@app/_lib/auth-client";

const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SigninForm = z.infer<typeof signinSchema>;

export default function SigninPage() {
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SigninForm) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            toast.warning(
              "Please verify your email before signing in. We've sent you a verification email."
            );
          } else {
            toast.error(ctx.error.message + " " + ctx.error.status + " " + ctx.error.code);
          }
        },
        onSuccess: () => {
          redirect({ href: "/", locale });
        },
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const handleGoogleSignin = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message + " " + ctx.error.status + " " + ctx.error.code);
        },
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1">
        <Image src="/logos/logo.webp" alt="Logo" width={60} height={60} className="mx-auto" />
        <CardTitle className="text-center text-xl">Welcome</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignin}
          disabled={isLoading}
        >
          <Image
            src="/logos/google.svg"
            alt="Google"
            className="mr-2 inline-block h-5 w-5"
            width={20}
            height={20}
          />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">Or</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-muted-foreground hover:text-primary text-sm underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground w-full text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="hover:text-primary underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
