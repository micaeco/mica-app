"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import { ConsumptionGranularity } from "@core/entities/consumption";

type Props = {
  resolution: ConsumptionGranularity;
  setResolution: (resolution: ConsumptionGranularity) => void;
};

export function TimeResolutionSelect({ resolution, setResolution }: Props) {
  const common = useTranslations("common");

  return (
    <Tabs
      value={resolution}
      onValueChange={(value) => {
        setResolution(value as ConsumptionGranularity);
      }}
    >
      <TabsList className="space-x-2">
        <TabsTrigger value="month" className="capitalize">
          {common("month")}
        </TabsTrigger>
        <TabsTrigger value="week" className="capitalize">
          {common("week")}
        </TabsTrigger>
        <TabsTrigger value="day" className="capitalize">
          {common("day")}
        </TabsTrigger>
        <TabsTrigger value="hour" className="capitalize">
          {common("hour")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
