"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@app/_components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@app/_components/ui/card";
import { Link, usePathname, useRouter } from "@app/_i18n/routing";
import { authClient } from "@app/_lib/auth-client";
import { trpc } from "@app/_lib/trpc";

export default function JoinHouseholdPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const t = useTranslations("joinHousehold");
  const tErrors = useTranslations("common.errors");

  const { data: user, isPending } = authClient.useSession();
  const [actionTaken, setActionTaken] = useState<"accepted" | "declined" | null>(null);

  const token = params.token as string;

  const { data: isValid, isLoading } = trpc.household.isInvitationTokenValid.useQuery(
    { token },
    {
      enabled: !!token,
    }
  );

  const acceptMutation = trpc.household.acceptInvitation.useMutation({
    onSuccess: () => setActionTaken("accepted"),
    onError: (error) => {
      const errorCode = error.data?.code || "INTERNAL_SERVER_ERROR";
      // @ts-expect-error - Dynamic key for error translation
      toast.error(tErrors.has(errorCode) ? tErrors(errorCode) : tErrors("INTERNAL_SERVER_ERROR"));
    },
  });

  const declineMutation = trpc.household.declineInvitation.useMutation({
    onSuccess: () => setActionTaken("declined"),
    onError: (error) => {
      const errorCode = error.data?.code || "INTERNAL_SERVER_ERROR";
      // @ts-expect-error - Dynamic key for error translation
      toast.error(tErrors.has(errorCode) ? tErrors(errorCode) : tErrors("INTERNAL_SERVER_ERROR"));
    },
  });

  useEffect(() => {
    if (!user && !isPending) {
      router.push({
        pathname: `/signin?callback=${encodeURIComponent(pathname)}`,
      });
    }
  }, [user, pathname, router, isPending]);

  const renderContent = () => {
    if (!token) {
      return (
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>{t("invalidTokenTitle")}</CardTitle>
          </CardHeader>
          <CardContent>{t("invalidTokenMessage")}</CardContent>
        </Card>
      );
    }

    if (isLoading) {
      return (
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>{t("loadingTitle")}</CardTitle>
          </CardHeader>
          <CardContent>{t("checkingTokenMessage")}</CardContent>
        </Card>
      );
    }

    if (!isValid) {
      return (
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>{t("invalidTokenTitle")}</CardTitle>
          </CardHeader>
          <CardContent>{t("expiredTokenMessage")}</CardContent>
        </Card>
      );
    }

    if (actionTaken) {
      return (
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>
              {t(
                actionTaken === "accepted" ? "invitationAcceptedTitle" : "invitationDeclinedTitle"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p>
              {t(
                actionTaken === "accepted"
                  ? "invitationAcceptedMessage"
                  : "invitationDeclinedMessage"
              )}
            </p>
            <Button asChild>
              <Link href="/">{t("goHome")}</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>{t("joinHouseholdTitle")}</CardTitle>
        </CardHeader>
        <CardContent>{t("joinHouseholdMessage")}</CardContent>
        <CardFooter className="flex gap-4">
          <Button
            onClick={() => acceptMutation.mutate({ token })}
            disabled={acceptMutation.isPending || declineMutation.isPending}
          >
            {acceptMutation.isPending ? t("acceptingButton") : t("acceptButton")}
          </Button>
          <Button
            variant="outline"
            onClick={() => declineMutation.mutate({ token })}
            disabled={acceptMutation.isPending || declineMutation.isPending}
          >
            {declineMutation.isPending ? t("decliningButton") : t("declineButton")}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">{renderContent()}</div>
  );
}
