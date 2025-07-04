"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
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
import { authClient } from "@app/_lib/auth-client";

export default function SignupPage() {
  const t = useTranslations();

  const signupSchema = z
    .object({
      name: z.string().min(1, t("auth.validation.name-required")),
      email: z
        .string()
        .email(t("auth.validation.email-invalid"))
        .min(1, t("auth.validation.email-required")),
      password: z.string().min(8, t("auth.validation.password-min")),
      confirmPassword: z.string().min(8, t("auth.validation.confirm-password-required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.validation.passwords-no-match"),
      path: ["confirmPassword"],
    });

  type SignupForm = z.infer<typeof signupSchema>;

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupForm) => {
    await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      fetchOptions: {
        onError: (ctx) => {
          const errorKey = `common.errors.${ctx.error.code}`;
          // @ts-expect-error - Dynamic key for error translation
          const translatedError = t(errorKey);
          toast.error(translatedError || ctx.error.message);
        },
        onSuccess: () => {
          toast.success(t("auth.signup.success-message"));
        },
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
      },
    });
  };

  const handleGoogleSignup = async () => {
    await authClient.signIn.social({
      provider: "google",
      fetchOptions: {
        onError: (ctx) => {
          const errorKey = `common.errors.${ctx.error.code}`;
          // @ts-expect-error - Dynamic key for error translation
          const translatedError = t(errorKey);
          toast.error(translatedError || ctx.error.message);
        },
        onSuccess: (ctx) => {
          toast.success(ctx.response.toString());
        },
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
      },
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1">
        <Image src="/logos/logo.webp" alt="Logo" className="mx-auto" width={60} height={60} />
        <CardTitle className="text-center text-xl">{t("auth.signup.title")}</CardTitle>
        <CardDescription className="text-center">{t("auth.signup.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={isLoading}
        >
          <Image
            src="/logos/google.svg"
            alt="Google"
            className="mr-2 inline-block h-5 w-5"
            width={20}
            height={20}
          />
          {t("auth.signup.google-signup")}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">{t("auth.signup.or")}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.signup.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("auth.signup.name-placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.signup.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("auth.signup.email-placeholder")} {...field} />
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
                  <FormLabel>{t("auth.signup.password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.signup.password-placeholder")}
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.signup.confirm-password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("auth.signup.confirm-password-placeholder")}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("auth.signup.signup-loading") : t("auth.signup.signup-button")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground w-full text-center text-sm">
          {t("auth.signup.has-account")}{" "}
          <Link href="/signin" className="hover:text-primary underline underline-offset-4">
            {t("auth.signup.signin-link")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
