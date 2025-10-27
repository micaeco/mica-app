"use client";

import { useState } from "react";

import Image from "next/image";

import { format } from "date-fns";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { ComparisonChart } from "@app/[locale]/(protected)/efficiency/_components/comparison-chart";
import { EfficiencyGauge } from "@app/[locale]/(protected)/efficiency/_components/efficiency-gauge";
import { KPIGauge } from "@app/[locale]/(protected)/efficiency/_components/kpi-gauge";
import { Alert, AlertDescription, AlertTitle } from "@app/_components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@app/_components/ui/card";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { cn } from "@app/_lib/utils";
import {
  Efficiency,
  efficiencyCategories,
  EfficiencyCategory,
  KPIToIcon,
  KPIToUnit,
  showerKPIThresholds,
  toiletKPIThresholds,
  washerKPIThresholds,
  dishwasherKPIThresholds,
  ShowerKPIType,
  ToiletKPIType,
  WasherKPIType,
  DishwasherKPIType,
  Thresholds,
} from "@domain/entities/efficiency";

function getKPIThresholds(category: EfficiencyCategory, kpiType: string): Thresholds {
  switch (category) {
    case "shower":
      return showerKPIThresholds[kpiType as ShowerKPIType];
    case "toilet":
      return toiletKPIThresholds[kpiType as ToiletKPIType];
    case "washer":
      return washerKPIThresholds[kpiType as WasherKPIType];
    case "dishwasher":
      return dishwasherKPIThresholds[kpiType as DishwasherKPIType];
  }
}

const mockEfficiency: Efficiency = {
  overall: {
    consumptionBenchmark: { value: 107, average: 130, target: 90 },
    thresholds: [90, 110, 140],
  },
  byCategory: {
    shower: {
      consumptionBenchmark: { value: 42, average: 56, target: 30 },
      thresholds: [30, 50, 70],
      kpis: [
        { type: "usesPerPersonDaily", value: 1 },
        { type: "timePerUse", value: 6 },
        { type: "flowRate", value: 7 },
      ],
    },
    toilet: {
      consumptionBenchmark: { value: 33, average: 36, target: 22.5 },
      thresholds: [22.5, 30, 40],
      kpis: [
        { type: "usesPerPersonDaily", value: 5.5 },
        { type: "tankVolume", value: 6 },
      ],
    },
    washer: {
      consumptionBenchmark: { value: 14, average: 25, target: 12 },
      thresholds: [12, 20, 30],
      kpis: [
        { type: "usesPerPersonDaily", value: 0.4 },
        { type: "consumptionPerCycle", value: 35 },
      ],
    },
    dishwasher: {
      consumptionBenchmark: { value: 18, average: 16, target: 9 },
      thresholds: [9, 15, 21],
      kpis: [
        { type: "usesPerPersonDaily", value: 0.5 },
        { type: "consumptionPerCycle", value: 36 },
      ],
    },
  },
  recommendations: [
    {
      id: "rec-001",
      description: {
        en: "Upgrade to a more efficient dishwasher",
        es: "Actualiza a un lavavajillas más eficiente",
        ca: "Actualitza a un rentavaixelles més eficient",
      },
      category: "dishwasher",
      percentatgeSavings: 72,
    },
    {
      id: "rec-002",
      description: {
        en: "Run dishwasher only when full",
        es: "Usa el lavavajillas solo cuando esté lleno",
        ca: "Usa el rentavaixelles només quan estigui ple",
      },
      category: "dishwasher",
      percentatgeSavings: 40,
    },
    {
      id: "rec-003",
      description: {
        en: "Install a dual-flush or low-flow toilet",
        es: "Instala un inodoro de doble descarga",
        ca: "Instal·la un vàter de doble descàrrega",
      },
      category: "toilet",
      percentatgeSavings: 25,
    },
    {
      id: "rec-004",
      description: {
        en: "Reduce shower time to 5 minutes",
        es: "Reduce el tiempo de ducha a 5 minutos",
        ca: "Redueix el temps de dutxa a 5 minuts",
      },
      category: "shower",
      percentatgeSavings: 17,
    },
  ],
};

export default function EfficiencyPage() {
  const locale = useLocale();
  const tCategories = useTranslations("common.categories");
  const tEfficiency = useTranslations("efficiency");
  const tKPIs = useTranslations("efficiency.kpis");
  const dateFnsLocale = getDateFnsLocale(locale);

  const [selectedCategory, setSelectedCategory] = useState<EfficiencyCategory | null>(null);

  const currentDate = new Date(2024, 3, 1);

  const thresholds = selectedCategory
    ? mockEfficiency.byCategory[selectedCategory].thresholds
    : mockEfficiency.overall.thresholds;

  const value = selectedCategory
    ? mockEfficiency.byCategory[selectedCategory].consumptionBenchmark.value
    : mockEfficiency.overall.consumptionBenchmark.value;

  const benchmark = selectedCategory
    ? mockEfficiency.byCategory[selectedCategory].consumptionBenchmark
    : mockEfficiency.overall.consumptionBenchmark;

  return (
    <div className="flex flex-col gap-4 p-6">
      <Alert className="max-w-xl">
        <AlertTriangle />
        <AlertTitle className="line-clamp-none">{tEfficiency("sampleDataNotice")}</AlertTitle>
        <AlertDescription>{tEfficiency("sampleDataDescription")}</AlertDescription>
      </Alert>

      <div className="flex justify-center 2xl:justify-start">
        <div className="bg-muted flex items-center gap-2 rounded-xl px-4 py-2">
          <button
            className="flex items-center justify-center transition-transform hover:-translate-x-1"
            aria-label={tEfficiency("previousMonth")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm">
            {format(currentDate, "MMMM yyyy", { locale: dateFnsLocale })}
          </span>
          <button
            className="flex items-center justify-center transition-transform hover:translate-x-1"
            aria-label={tEfficiency("nextMonth")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-row justify-center gap-6 2xl:justify-start">
        {efficiencyCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
          >
            <div className="relative flex items-center justify-center">
              <div
                className={cn(
                  "rounded-full border-1 bg-white p-2 transition-colors",
                  category === selectedCategory && "bg-muted shadow-lg"
                )}
              >
                <Image
                  src={`/icons/${category}.webp`}
                  alt=""
                  width={36}
                  height={36}
                  className={cn(
                    "transition-opacity",
                    category === selectedCategory ? "opacity-100" : "opacity-50"
                  )}
                />
              </div>
              <div
                className={cn(
                  "absolute top-0 right-0 h-3 w-3 rounded-full transition-opacity",
                  category !== selectedCategory && "opacity-50",
                  mockEfficiency.byCategory[category].consumptionBenchmark.value >
                    mockEfficiency.byCategory[category].thresholds[1]
                    ? "bg-brand-quaternary"
                    : "bg-brand-secondary"
                )}
              />
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 2xl:flex-row">
        <Card className="relative h-fit overflow-hidden 2xl:min-w-1/3">
          <CardHeader>
            <CardTitle>{tEfficiency("title")}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6 flex justify-center">
              <div className="w-full max-w-md">
                <EfficiencyGauge thresholds={thresholds} value={value} />
              </div>
            </div>

            {selectedCategory && mockEfficiency.byCategory[selectedCategory].kpis && (
              <div className="flex flex-row items-center justify-around">
                {mockEfficiency.byCategory[selectedCategory].kpis.map((kpi) => (
                  <KPIGauge
                    key={kpi.type}
                    value={kpi.value}
                    unit={KPIToUnit[kpi.type as keyof typeof KPIToUnit] ?? ""}
                    thresholds={getKPIThresholds(selectedCategory, kpi.type)}
                    label={tKPIs(kpi.type)}
                    icon={KPIToIcon[kpi.type as keyof typeof KPIToIcon]}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex w-full flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{tEfficiency("compareYourself")}</span>
                <span className="text-muted-foreground text-sm">{tEfficiency("unit")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonChart benchmark={benchmark} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{tEfficiency("recommendations")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              {mockEfficiency.recommendations.filter(
                (rec) => !selectedCategory || rec.category === selectedCategory
              ).length > 0 ? (
                mockEfficiency.recommendations
                  .filter((rec) => !selectedCategory || rec.category === selectedCategory)
                  .map((rec) => (
                    <Card key={rec.id} className="bg-muted flex-1 basis-64 border-0 shadow-none">
                      <CardContent className="items-left flex h-full flex-col gap-2 pt-4">
                        <Image
                          src={`/icons/${rec.category}.webp`}
                          alt={rec.category}
                          width={24}
                          height={24}
                        />
                        <span>{rec.description[locale as "en" | "es" | "ca"]}</span>
                        <span className="text-brand-secondary font-bold">
                          {rec.percentatgeSavings}%
                        </span>
                      </CardContent>
                    </Card>
                  ))
              ) : selectedCategory ? (
                <p>
                  {tEfficiency("optimalConsumptionCategory", {
                    category: tCategories(selectedCategory).toLowerCase(),
                  })}
                </p>
              ) : (
                <p>{tEfficiency("optimalConsumption")}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
