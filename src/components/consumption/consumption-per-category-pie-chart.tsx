import React, { useCallback, useMemo } from "react";
import { Cell, Pie, PieChart, Sector } from "recharts";
import { ChartConfig, ChartContainer } from "../ui/chart";
import { getCategories } from "@/lib/utils";
import { Category, TimeWindow } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { Event } from "@/types";

type Props = {
  events: Event[];
  timeWindow: TimeWindow;
  category: Category | undefined;
  setCategory: (category: Category | undefined) => void;
};

export default function ConsumptionPerCategoryPieChart({
  events,
  timeWindow,
  category,
  setCategory,
}: Props) {
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
      const isLeft = midAngle > 90 && midAngle < 270;
      const RADIAN = Math.PI / 180;
      const radius =
        innerRadius + (outerRadius - innerRadius) * (isActive ? 2.1 : 1.9);
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      const percentage = (
        (payload.consumption / totalConsumption) *
        100
      ).toFixed(1);

      const textClasses = "select-none";
      const xOffset = isLeft ? -25 : 25;
      const textAnchor = isLeft ? "end" : "start";

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
                className={`${textClasses} font-bold text-sm`}
                x={x + xOffset}
                y={y - 5}
                textAnchor={textAnchor}
              >
                {percentage}%
              </text>
              <text
                className={textClasses}
                x={x + xOffset}
                y={y + 15}
                textAnchor={textAnchor}
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
        <CardTitle>Filtra el consum per categoria.</CardTitle>
        <CardDescription>
          Selecciona una de les seccions per veure el consum.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full min-h-[300px]">
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
