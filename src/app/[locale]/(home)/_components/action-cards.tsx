"use client";

import { ArrowRight, Bell, CircleHelp } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@app/_components/ui/card";
import { useRouter } from "@app/_i18n/routing";
import { trpc } from "@app/_lib/trpc";
import { cn } from "@app/_lib/utils";
import { useHouseholdStore } from "@app/_stores/household";

export function ActionCards({ className }: { className?: string }) {
  const { selectedHouseholdId } = useHouseholdStore();

  const router = useRouter();
  const tActionCards = useTranslations("action-cards");
  const tErrors = useTranslations("common.errors");
  const tCommon = useTranslations("common");

  const {
    data: leakEvents,
    isLoading: isLoadingLeakEvents,
    error: errorLeakEvents,
  } = trpc.event.getNumberOfLeakEvents.useQuery(
    {
      householdId: selectedHouseholdId,
    },
    {
      enabled: !!selectedHouseholdId,
    }
  );

  const {
    data: unknownEvents,
    isLoading: isLoadingUnknownEvents,
    error: errorUnknownEvents,
  } = trpc.event.getNumberOfUnknownEvents.useQuery(
    {
      householdId: selectedHouseholdId,
    },
    {
      enabled: !!selectedHouseholdId,
    }
  );

  const isLoading = isLoadingLeakEvents || isLoadingUnknownEvents;
  const error = errorLeakEvents ?? errorUnknownEvents;

  if (isLoading) {
    return <div> {tCommon("loading")}...</div>;
  }

  if (error) {
    toast.error(tErrors(/*error.data?.code || */ "INTERNAL_SERVER_ERROR"));
    return <div></div>;
  }

  const hasLeakEvents = (leakEvents ?? 0) > 0;
  const hasUnknownEvents = (unknownEvents ?? 0) > 0;

  return (
    <div className={cn("flex gap-2", className)}>
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
          <p className="line-clamp-2">
            {hasLeakEvents
              ? tActionCards("leaks.description", { count: leakEvents })
              : tCommon("no-data")}
          </p>
          <ArrowRight className="absolute right-4 bottom-2 transition-transform group-hover:translate-x-2" />
        </CardContent>
      </Card>
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
          <p className="line-clamp-2">
            {hasUnknownEvents
              ? tActionCards("categorize.description", { count: unknownEvents })
              : tCommon("no-data")}
          </p>
          <ArrowRight className="absolute right-4 bottom-2 transition-transform group-hover:translate-x-2" />
        </CardContent>
      </Card>
    </div>
  );
}
