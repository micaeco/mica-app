"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Skeleton } from "@app/_components/ui/skeleton";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@app/_components/ui/tabs";
import { trpc } from "@app/_lib/trpc";
import { cn } from "@app/_lib/utils";
import { useHouseholdStore } from "@app/_stores/household";

export function ConsumptionTabs() {
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("common.errors");

  const [resolution, setResolution] = useState<"month" | "today">("month");

  const { selectedHouseholdId } = useHouseholdStore();

  const queryOptions = {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  };

  const {
    data: consumptionMonth,
    isLoading: isLoadingMonth,
    error: errorMonth,
  } = trpc.consumption.getCurrentMonthConsumption.useQuery(
    { householdId: selectedHouseholdId },
    {
      ...queryOptions,
      enabled: !!selectedHouseholdId && resolution == "month",
    }
  );

  const {
    data: consumptionToday,
    isLoading: isLoadingToday,
    error: errorToday,
  } = trpc.consumption.getCurrentDayConsumption.useQuery(
    { householdId: selectedHouseholdId },
    {
      ...queryOptions,
      enabled: !!selectedHouseholdId && resolution == "today",
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isLoading = isLoadingMonth || isLoadingToday;
  const error = errorMonth ?? errorToday;

  if (error) {
    toast.error(tErrors(/*error.data?.code || */ "INTERNAL_SERVER_ERROR"));
  }

  return (
    <Tabs defaultValue="month">
      <TabsList className="w-fit">
        <TabsTrigger value="month" onClick={() => setResolution("month")}>
          {tCommon("this") + " " + tCommon("month")}
        </TabsTrigger>
        <TabsTrigger value="today" onClick={() => setResolution("today")}>
          {tCommon("today")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="month">
        {consumptionMonth ? (
          <div className="flex flex-col text-right">
            <p
              className={cn(
                consumptionMonth.consumptionPercentDeviationFromBaseline > 0
                  ? "text-red-500"
                  : "text-green-500"
              )}
            >
              {consumptionMonth.consumptionPercentDeviationFromBaseline}%
            </p>
            <h2>{consumptionMonth.consumptionInLiters} L</h2>
            <p>
              {consumptionMonth.consumptionInLitersPerDayPerPerson} L / {tCommon("person")}{" "}
              {tCommon("day")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col text-center">
            <p>{tCommon("no-data")}</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="today">
        {consumptionToday ? (
          <div className="flex flex-col text-right">
            <p
              className={cn(
                consumptionToday.consumptionPercentDeviationFromBaseline > 0
                  ? "text-red-500"
                  : "text-green-500"
              )}
            >
              {consumptionToday.consumptionPercentDeviationFromBaseline}%
            </p>
            <h2>{consumptionToday.consumptionInLiters} L</h2>
            <p>
              {consumptionToday.consumptionInLitersPerDayPerPerson} L / {tCommon("person")}{" "}
              {tCommon("day")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col text-center">
            <p>{tCommon("no-data")}</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

export function ConsumptionBlockSkeleton() {
  return (
    <div className="mt-2 flex flex-col items-end space-y-2">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
