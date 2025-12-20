"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
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
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callback") || "/";

  const locale = useLocale();
  const t = useTranslations();

  const signupSchema = z
    .object({
      name: z.string().min(1, t("auth.validation.nameRequired")),
      email: z
        .string()
        .email(t("auth.validation.emailInvalid"))
        .min(1, t("auth.validation.emailRequired")),
      password: z.string().min(8, t("auth.validation.passwordMin")),
      confirmPassword: z.string().min(8, t("auth.validation.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.validation.passwordsNoMatch"),
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
    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        locale,
        callbackURL,
      },
      {
        onError: (ctx) => {
          const errorKey = `common.errors.${ctx.error.code}`;
          toast.error(t.has(errorKey) ? t(errorKey) : ctx.error.message);
        },
        onSuccess: () => {
          toast.success(t("auth.signup.successMessage"));
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

  const handleGoogleSignup = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL,
      },
      {
        onError: (ctx) => {
          const errorKey = `common.errors.${ctx.error.code}`;
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
      }
    );
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
          {t("auth.signup.googleSignup")}
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
                    <Input placeholder={t("auth.signup.namePlaceholder")} {...field} />
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
                    <Input placeholder={t("auth.signup.emailPlaceholder")} {...field} />
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
                        placeholder={t("auth.signup.passwordPlaceholder")}
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
                  <FormLabel>{t("auth.signup.confirmPassword")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("auth.signup.confirmPasswordPlaceholder")}
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
              {isLoading ? t("auth.signup.signupLoading") : t("auth.signup.signupButton")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground w-full text-center text-sm">
          {t("auth.signup.hasAccount")}{" "}
          <Link
            href={`/signin?callback=${encodeURIComponent(callbackURL)}`}
            className="hover:text-primary underline underline-offset-4"
          >
            {t("auth.signup.signinLink")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
