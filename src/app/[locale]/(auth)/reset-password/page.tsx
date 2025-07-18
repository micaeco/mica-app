"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const ResetPasswordSchema = z
    .object({
      password: z.string().min(8, { message: t("auth.validation.password-min") }),
      confirmPassword: z
        .string()
        .min(8, { message: t("auth.validation.confirm-password-required") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.validation.passwords-no-match"),
      path: ["confirmPassword"],
    });

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
          toast.success(t("auth.reset-password.success-message"));
          router.push("/signin");
        },
        onError: (ctx) => {
          const errorKey = `common.errors.${ctx.error.code}`;
          // @ts-expect-error - Dynamic key for error translation
          toast.error(t.has(errorKey) ? t(errorKey) : ctx.error.message);
        },
      }
    );
  };

  if (tokenStatus === "checking") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("auth.reset-password.checking-token")}</CardTitle>
          <CardDescription hidden></CardDescription>
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
          <CardTitle>{t("auth.reset-password.invalid-token.title")}</CardTitle>
          <CardDescription>{t("auth.reset-password.invalid-token.description")}</CardDescription>
        </CardHeader>
        <CardFooter>
          <p className="text-muted-foreground w-full text-center text-sm">
            <Link
              href="/forgot-password"
              className="hover:text-primary underline underline-offset-4"
            >
              {t("auth.reset-password.get-new-link")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("auth.reset-password.title")}</CardTitle>
        <CardDescription>{t("auth.reset-password.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.reset-password.password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={loading}
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.reset-password.password-placeholder")}
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
                  <FormLabel>{t("auth.reset-password.confirm-password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={loading}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("auth.reset-password.confirm-password-placeholder")}
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
              {loading
                ? t("auth.reset-password.reset-loading")
                : t("auth.reset-password.reset-button")}
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
