"use client";

import { useState } from "react";

import Image from "next/image";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { ComparisonChart } from "@app/[locale]/(protected)/efficiency/_components/comparison-chart";
import { EfficiencyGauge } from "@app/[locale]/(protected)/efficiency/_components/efficiency-gauge";
import { KPIGauge } from "@app/[locale]/(protected)/efficiency/_components/kpi-gauge";
import { Card, CardContent, CardHeader, CardTitle } from "@app/_components/ui/card";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { cn } from "@app/_lib/utils";
import {
  Efficiency,
  efficiencyCategories,
  EfficiencyCategory,
  KPIToIcon,
  KPIToThreshold,
  KPIToUnit,
} from "@domain/entities/efficiency";

const mockEfficiency: Efficiency = {
  overall: {
    consumptionBenchmark: { value: 105, average: 120, target: 95 },
    thresholds: [100, 120, 150],
  },
  byCategory: {
    shower: {
      consumptionBenchmark: { value: 60, average: 70, target: 50 },
      thresholds: [55, 69, 92],
      kpis: [
        { type: "usesPerPersonDaily", value: 4.2 },
        { type: "timePerUse", value: 4.6 },
        { type: "flowRate", value: 10.3 },
      ],
    },
    toilet: {
      consumptionBenchmark: { value: 29, average: 30, target: 20 },
      thresholds: [21, 27, 34],
      kpis: [{ type: "tankVolume", value: 8.3 }],
    },
    washer: {
      consumptionBenchmark: { value: 17, average: 15, target: 10 },
      thresholds: [11, 14.2, 19],
      kpis: [{ type: "consumptionPerCycle", value: 42.2 }],
    },
    dishwasher: {
      consumptionBenchmark: { value: 8, average: 10, target: 6 },
      thresholds: [6.5, 9.5, 12.8],
      kpis: [{ type: "consumptionPerCycle", value: 41.0 }],
    },
  },
  recommendations: [
    {
      id: "rec-001",
      description: {
        en: "Turn off the water while soaping",
        es: "Cierra el agua mientras te enjabonas",
        ca: "Tanca l'aigua mentre t'ensabones",
      },
      category: "shower",
      percentatgeSavings: 5,
    },
    {
      id: "rec-002",
      description: {
        en: "Install a more efficient shower head",
        es: "Instala un cabezal de ducha más eficiente",
        ca: "Instal·la una carxofa més eficient",
      },
      category: "shower",
      percentatgeSavings: 20,
    },
    {
      id: "rec-003",
      description: {
        en: "Install a more efficient flush tank",
        es: "Instala una cisterna más eficiente",
        ca: "Instal·la una cisterna més eficient",
      },
      category: "toilet",
      percentatgeSavings: 30,
    },
    {
      id: "rec-004",
      description: {
        en: "Use eco programs",
        es: "Utiliza programas eco",
        ca: "Utilitza programes eco",
      },
      category: "washer",
      percentatgeSavings: 30,
    },
    {
      id: "rec-005",
      description: {
        en: "Wait for a full load",
        es: "Espera a tener una carga completa",
        ca: "Espera a tenir una càrrega completa",
      },
      category: "washer",
      percentatgeSavings: 10,
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
        <Card className="h-fit 2xl:min-w-1/3">
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
                    thresholds={KPIToThreshold[kpi.type as keyof typeof KPIToThreshold]}
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
