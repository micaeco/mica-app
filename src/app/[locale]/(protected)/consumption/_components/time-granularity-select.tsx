"use client";

import React from "react";

import { useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@app/_components/ui/tabs";
import { Granularity } from "@domain/entities/consumption";

type Props = {
  granularity: Granularity;
  setGranularity: (granularity: Granularity) => void;
};

export function TimeGranularitySelect({ granularity, setGranularity }: Props) {
  const common = useTranslations("common");

  return (
    <Tabs
      value={granularity}
      onValueChange={(value) => {
        setGranularity(value as Granularity);
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
