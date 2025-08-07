"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { ChevronUp, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Skeleton } from "@app/_components/ui/skeleton";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@app/_components/ui/tabs";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";

export function ConsumptionTabs() {
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultGranularity = "today" as const;
  const granularity = (searchParams.get("granularity") as "month" | "today") || defaultGranularity;

  const { selectedHouseholdId } = useHouseholdStore();

  const updateGranularity = (newGranularity: "month" | "today") => {
    const params = new URLSearchParams(searchParams);
    params.set("granularity", newGranularity);
    router.replace(`?${params.toString()}`);
  };

  const { data: consumptionMonth, isLoading: isLoadingMonth } =
    trpc.consumption.getCurrentMonthConsumption.useQuery(
      { householdId: selectedHouseholdId },
      {
        enabled: !!selectedHouseholdId && granularity == "month",
      }
    );

  const { data: consumptionToday, isLoading: isLoadingToday } =
    trpc.consumption.getCurrentDayConsumption.useQuery(
      { householdId: selectedHouseholdId },
      {
        enabled: !!selectedHouseholdId && granularity == "today",
      }
    );

  return (
    <Tabs value={granularity} className="flex min-w-70 flex-col items-center justify-center">
      <TabsList className="w-fit">
        <TabsTrigger value="today" onClick={() => updateGranularity("today")}>
          {tCommon("today")}
        </TabsTrigger>
        <TabsTrigger value="month" onClick={() => updateGranularity("month")}>
          {tCommon("this") + " " + tCommon("month")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="month">
        {consumptionMonth ? (
          <div className="flex flex-col text-right">
            <p className="flex items-center justify-end">
              {consumptionMonth.consumptionPercentDeviationFromBaseline > 0 ? (
                <ChevronUp />
              ) : (
                <ChevronDown />
              )}
              {Math.abs(consumptionMonth.consumptionPercentDeviationFromBaseline).toFixed(0)}%
            </p>
            <h2>{consumptionMonth.consumptionInLiters.toFixed(0)} L</h2>
            <p>
              {consumptionMonth.consumptionInLitersPerDayPerPerson.toFixed(2)} L /{" "}
              {tCommon("person")} {tCommon("day")}
            </p>
          </div>
        ) : isLoadingMonth ? (
          <ConsumptionBlockSkeleton />
        ) : (
          <div className="flex flex-col text-center">
            <p>{tCommon("noData")}</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="today">
        {consumptionToday ? (
          <div className="flex flex-col text-right">
            <p className="flex items-center justify-end">
              {consumptionToday.consumptionPercentDeviationFromBaseline > 0 ? (
                <ChevronUp />
              ) : (
                <ChevronDown />
              )}
              {Math.abs(consumptionToday.consumptionPercentDeviationFromBaseline).toFixed(0)}%
            </p>
            <h2>{consumptionToday.consumptionInLiters.toFixed(0)} L</h2>
            <p>
              {consumptionToday.consumptionInLitersPerDayPerPerson.toFixed(2)} L /{" "}
              {tCommon("person")} {tCommon("day")}
            </p>
          </div>
        ) : isLoadingToday ? (
          <ConsumptionBlockSkeleton />
        ) : (
          <div className="flex flex-col text-center">
            <p>{tCommon("noData")}</p>
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
