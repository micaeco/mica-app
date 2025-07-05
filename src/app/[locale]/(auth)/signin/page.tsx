"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

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
import { redirect } from "@app/_i18n/routing";
import { authClient } from "@app/_lib/auth-client";

export default function SigninPage() {
  const locale = useLocale();
  const t = useTranslations();

  const signinSchema = z.object({
    email: z
      .string()
      .email(t("auth.validation.email-invalid"))
      .min(1, t("auth.validation.email-required")),
    password: z.string().min(8, t("auth.validation.password-min")),
  });

  type SigninForm = z.infer<typeof signinSchema>;

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
          const errorKey = `common.errors.${ctx.error.code}`;
          // @ts-expect-error - Dynamic key for error translation
          toast.error(t.has(errorKey) ? t(errorKey) : ctx.error.message);
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
          const errorKey = `common.errors.${ctx.error.code}`;
          // @ts-expect-error - Dynamic key for error translation
          const translatedError = t(errorKey);
          toast.error(translatedError || ctx.error.message);
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
        <CardTitle className="text-center text-xl">{t("auth.signin.title")}</CardTitle>
        <CardDescription className="text-center">{t("auth.signin.description")}</CardDescription>
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
          {t("auth.signin.google-signin")}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">{t("auth.signin.or")}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.signin.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("auth.signin.email-placeholder")} {...field} />
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
                    <FormLabel>{t("auth.signin.password")}</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-muted-foreground hover:text-primary text-sm underline underline-offset-4"
                    >
                      {t("auth.signin.forgot-password")}
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.signin.password-placeholder")}
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
              {isLoading ? t("auth.signin.signin-loading") : t("auth.signin.signin-button")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground w-full text-center text-sm">
          {t("auth.signin.no-account")}{" "}
          <Link href="/signup" className="hover:text-primary underline underline-offset-4">
            {t("auth.signin.signup-link")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
