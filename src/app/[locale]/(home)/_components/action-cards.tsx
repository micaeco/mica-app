"use client";

import { ArrowRight, Bell, CircleHelp } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@app/_components/ui/card";
import { Skeleton } from "@app/_components/ui/skeleton";
import { useRouter } from "@app/_i18n/routing";
import { trpc } from "@app/_lib/trpc";
import { cn } from "@app/_lib/utils";
import { useHouseholdStore } from "@app/_stores/household";

export function ActionCards({ className }: { className?: string }) {
  const { selectedHouseholdId } = useHouseholdStore();

  const router = useRouter();
  const tActionCards = useTranslations("action-cards");

  const { data: leakEvents, isLoading: isLoadingLeakEvents } =
    trpc.event.getNumberOfLeakEvents.useQuery(
      {
        householdId: selectedHouseholdId,
      },
      {
        enabled: !!selectedHouseholdId,
      }
    );

  const { data: unknownEvents, isLoading: isLoadingUnknownEvents } =
    trpc.event.getNumberOfUnknownEvents.useQuery(
      {
        householdId: selectedHouseholdId,
      },
      {
        enabled: !!selectedHouseholdId,
      }
    );

  const hasLeakEvents = (leakEvents ?? 0) > 0;
  const hasUnknownEvents = (unknownEvents ?? 0) > 0;

  return (
    <div className={cn("flex gap-2", className)}>
      {hasLeakEvents && (
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
      )}
      {hasUnknownEvents && (
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
      )}
    </div>
  );
}
