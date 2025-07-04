"use client";

import { useState } from "react";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { authClient } from "@app/_lib/auth-client";

export default function ForgotPassword() {
  const t = useTranslations();

  const ForgotPasswordSchema = z.object({
    email: z
      .string()
      .email({ message: t("auth.validation.email-invalid") })
      .min(1, { message: t("auth.validation.email-required") }),
  });

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    await authClient.forgetPassword(
      {
        email: values.email,
        redirectTo: "/reset-password",
      },
      {
        onResponse: () => {
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          toast.success(t("auth.forgot-password.success-message"));
        },
        onError: (ctx) => {
          const errorKey = `common.errors.${ctx.error.code}`;
          // @ts-expect-error - Dynamic key for error translation
          const translatedError = t(errorKey);
          toast.error(translatedError || ctx.error.message);
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("auth.forgot-password.title")}</CardTitle>
        <CardDescription hidden></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.forgot-password.email")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="email"
                      placeholder={t("auth.forgot-password.email-placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit" className="w-full">
              {t("auth.forgot-password.submit")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-sm">
          {t("auth.forgot-password.remember")}{" "}
          <Link href="/signin" className="hover:text-primary underline underline-offset-4">
            {t("auth.forgot-password.signin-link")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
