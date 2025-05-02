"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Consumption } from "@domain/entities/consumption";
import { cn } from "@presentation/lib/utils";
import { useHouseholdStore } from "@presentation/stores/household";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@presentation/components/ui/tabs";
import { getCurrentDayConsumption, getCurrentMonthConsumption } from "@app/[locale]/(home)/actions";

export function ConsumptionTabs() {
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");

  const [consumption, setConsumption] = useState<Consumption | null>(null);
  const [resolution, setResolution] = useState<"month" | "today">("month");

  const { selectedHouseholdId } = useHouseholdStore();

  useEffect(() => {
    async function fetchConsumption() {
      if (resolution === "month") {
        const result = await getCurrentMonthConsumption(selectedHouseholdId);

        if (!result.success) {
          toast.error(tErrors(result.error));
          return;
        }

        setConsumption(result.data);
      }
      if (resolution === "today") {
        const result = await getCurrentDayConsumption(selectedHouseholdId);

        if (!result.success) {
          toast.error(tErrors(result.error));
          return;
        }

        setConsumption(result.data);
      }
    }

    fetchConsumption();
  }, [resolution, selectedHouseholdId, tErrors]);

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
        {consumption && (
          <div className="flex flex-col text-right">
            <p
              className={cn(
                consumption.consumptionPercentDeviationFromBaseline > 0
                  ? "text-red-500"
                  : "text-green-500"
              )}
            >
              {consumption.consumptionPercentDeviationFromBaseline}%
            </p>
            <h2>{consumption.consumptionInLiters} L</h2>
            <p>
              {consumption.consumptionInLitersPerDayPerPerson} L / {tCommon("person")}{" "}
              {tCommon("day")}
            </p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="today">
        {consumption && (
          <div className="flex flex-col text-right">
            <p
              className={cn(
                consumption.consumptionPercentDeviationFromBaseline > 0
                  ? "text-red-500"
                  : "text-green-500"
              )}
            >
              {consumption.consumptionPercentDeviationFromBaseline}%
            </p>
            <h2>{consumption.consumptionInLiters} L</h2>
            <p>
              {consumption.consumptionInLitersPerDayPerPerson} L / {tCommon("person")}{" "}
              {tCommon("day")}
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
