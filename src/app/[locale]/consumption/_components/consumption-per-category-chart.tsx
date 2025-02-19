import React, { useMemo } from "react";
import { Cell, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { ChartConfig, ChartContainer } from "@components/ui/chart";
import { getCategories } from "@/lib/utils";
import { Event, Category, TimeWindow } from "@/lib/types";

type Props = {
  events: Event[];
  timeWindow: TimeWindow;
  category: Category | undefined;
  setCategory: (category: Category | undefined) => void;
};

export function ConsumptionPerCategoryChart({ events, timeWindow, category, setCategory }: Props) {
  const categories = getCategories(events, timeWindow);

  const totalConsumption = useMemo(
    () => categories.reduce((sum, category) => sum + category.consumption!, 0),
    [categories]
  );

  const chartConfig: ChartConfig = categories.reduce((config: ChartConfig, category) => {
    config[category.name] = {
      label: category.name,
      color: category.color,
    };
    return config;
  }, {});

  const activeIndex = useMemo(
    () => categories.findIndex((c) => c.name === category?.name),
    [category, categories]
  );

  const handlePieSectionClick = (clickedCategory: Category) => {
    setCategory(category?.name === clickedCategory.name ? undefined : clickedCategory);
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    payload,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    payload: Category;
    index: number;
  }) => {
    const isActive = index === activeIndex;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * (isActive ? 1.3 : 1.2);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const percentage = ((payload.consumption! / totalConsumption) * 100).toFixed(1);

    const textClasses = "select-none text-center";

    return (
      <g>
        <image
          href={payload.icon}
          x={x - 20}
          y={y - 20}
          width={40}
          height={40}
          onClick={() => handlePieSectionClick(payload)}
          style={{ cursor: "pointer" }}
        />
        {isActive && (
          <>
            <text
              className={`${textClasses} text-xl font-bold`}
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
  };

  return (
    <ChartContainer config={chartConfig} className="aspect-13/9 min-h-[280px] w-full">
      <PieChart>
        <Pie
          data={categories}
          dataKey="consumption"
          nameKey="name"
          outerRadius="70%"
          innerRadius="50%"
          activeIndex={activeIndex}
          isAnimationActive={false}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
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
  );
}
