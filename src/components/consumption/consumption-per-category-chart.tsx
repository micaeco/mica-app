import React, { useCallback, useMemo } from "react";
import { Cell, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { useTranslations } from "next-intl";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { getCategories } from "@/lib/utils";
import { Event, Category, TimeWindow } from "@/lib/types";

type Props = {
  events: Event[];
  timeWindow: TimeWindow;
  category: Category | undefined;
  setCategory: (category: Category | undefined) => void;
};

export default function ConsumptionPerCategoryChart({
  events,
  timeWindow,
  category,
  setCategory,
}: Props) {
  const t = useTranslations("consumption-per-category-chart");

  let categories = getCategories(events, timeWindow);

  const totalConsumption = useMemo(
    () => categories.reduce((sum, category) => sum + category.consumption, 0),
    [categories]
  );

  const chartConfig: ChartConfig = categories.reduce(
    (config: ChartConfig, category) => {
      config[category.name] = {
        label: category.name,
        color: category.color,
      };
      return config;
    },
    {}
  );

  const activeIndex = useMemo(
    () => categories.findIndex((c) => c.name === category?.name),
    [category, categories]
  );

  const renderCustomizedLabel = useCallback(
    ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      payload,
      index,
    }: {
      cx: number;
      cy: number;
      midAngle: number;
      innerRadius: number;
      outerRadius: number;
      payload: any;
      index: number;
    }) => {
      const isActive = index === activeIndex;
      const RADIAN = Math.PI / 180;
      const radius =
        innerRadius + (outerRadius - innerRadius) * (isActive ? 2.1 : 1.9);
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      const percentage = (
        (payload.consumption / totalConsumption) *
        100
      ).toFixed(1);

      const textClasses = "select-none text-center";

      return (
        <g>
          <image
            href={payload.icon}
            x={x - 20}
            y={y - 20}
            width={40}
            height={40}
          />
          {isActive && (
            <>
              <text
                className={`${textClasses} font-bold text-xl`}
                x={cx}
                y={cy - 10}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {percentage}%
              </text>
              <text
                className={`${textClasses} text-xl`}
                x={cx}
                y={cy + 20}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {payload.consumption} L
              </text>
            </>
          )}
        </g>
      );
    },
    [activeIndex, totalConsumption]
  );

  const handlePieSectionClick = (clickedCategory: Category) => {
    setCategory(
      category?.name === clickedCategory.name ? undefined : clickedCategory
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full min-h-[38vh]">
          <PieChart>
            <Pie
              data={categories}
              dataKey="consumption"
              nameKey="name"
              outerRadius="70%"
              innerRadius="50%"
              activeIndex={activeIndex}
              isAnimationActive={false}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                </g>
              )}
              labelLine={false}
              label={renderCustomizedLabel}
              paddingAngle={2}
            >
              {categories.map((currentCategory, index) => (
                <Cell
                  key={index}
                  fill={
                    activeIndex === index
                      ? `hsl(var(${currentCategory.color}))`
                      : `hsl(var(${currentCategory.color})/0.5)`
                  }
                  onClick={() => handlePieSectionClick(currentCategory)}
                  className="cursor-pointer"
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
