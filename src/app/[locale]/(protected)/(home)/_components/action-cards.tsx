"use client";

import { ArrowRight, Bell, CircleHelp } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@app/_components/ui/card";
import { Skeleton } from "@app/_components/ui/skeleton";
import { useRouter } from "@app/_i18n/routing";
import { cn } from "@app/_lib/utils";

export function ActionCards({
  leakEvents,
  isLoadingLeakEvents,
  unknownEvents,
  isLoadingUnknownEvents,
  className,
}: {
  leakEvents?: number;
  isLoadingLeakEvents: boolean;
  unknownEvents?: number;
  isLoadingUnknownEvents: boolean;
  className?: string;
}) {
  const router = useRouter();
  const tActionCards = useTranslations("action-cards");

  return (
    <div className={cn("flex gap-2", className)}>
      {leakEvents ? (
        <Card
          className="group bg-brand-tertiary relative min-w-32 cursor-pointer pb-4"
          onClick={() => router.push("/actions")}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Bell />
              {tActionCards("leaks.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingLeakEvents ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <p className="line-clamp-2">
                {tActionCards("leaks.description", { count: leakEvents })}
              </p>
            )}
            <ArrowRight className="absolute right-4 bottom-2 transition-transform group-hover:translate-x-2" />
          </CardContent>
        </Card>
      ) : null}
      {unknownEvents ? (
        <Card
          className="group bg-brand-tertiary relative min-w-52 cursor-pointer pb-4"
          onClick={() => router.push("/actions")}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <CircleHelp />
              {tActionCards("categorize.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUnknownEvents ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <p className="line-clamp-2">
                {tActionCards("categorize.description", { count: unknownEvents })}
              </p>
            )}
            <ArrowRight className="absolute right-4 bottom-2 transition-transform group-hover:translate-x-2" />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
