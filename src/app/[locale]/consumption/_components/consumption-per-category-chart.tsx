import { useState } from "react";
import { Cell, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { categories, Category } from "@core/entities/category";
import { CategoryBreakdown } from "@core/entities/consumption";
import { ChartConfig, ChartContainer } from "@components/ui/chart";

type Props = {
  setSelectedCategories: (category: Category[] | undefined) => void;
  categoryBreakdown: CategoryBreakdown[];
};

const chartConfig: ChartConfig = categories.reduce((config: ChartConfig, category) => {
  config[category.type] = {
    label: category.type,
    color: category.color,
  };
  return config;
}, {});

export function ConsumptionPerCategoryChart({ setSelectedCategories, categoryBreakdown }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category | undefined>(undefined);

  const handlePieSectionClick = (clickedCategory: Category) => {
    if (activeCategory && activeCategory.type === clickedCategory.type) {
      setActiveCategory(undefined);
      setSelectedCategories(undefined);
    } else {
      if (clickedCategory.type === "rest") {
        const restCategories = categories.filter(
          (category) => !categoryBreakdown.some((item) => item.type === category.type)
        );
        setActiveCategory(clickedCategory);
        setSelectedCategories(restCategories);
      } else {
        setActiveCategory(clickedCategory);
        setSelectedCategories([clickedCategory]);
      }
    }
  };

  return (
    <ChartContainer config={chartConfig} className="aspect-13/9 min-h-[280px] w-full">
      <PieChart>
        <Pie
          data={categoryBreakdown}
          dataKey="consumptionInLiters"
          nameKey="type"
          outerRadius="70%"
          innerRadius="50%"
          activeIndex={categoryBreakdown.findIndex((item) => item.type === activeCategory?.type)}
          isAnimationActive={false}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
          labelLine={false}
          label={(props) =>
            renderCustomizedLabel({
              ...props,
              isActive: props.payload.type === activeCategory?.type,
              handlePieSectionClick,
            })
          }
          paddingAngle={2}
        >
          {categoryBreakdown.map((item) => {
            const matchingCategory = categories.find((c) => c.type === item.type);
            if (!matchingCategory) return null;

            const isActive = activeCategory?.type === item.type;

            return (
              <Cell
                key={item.type}
                fill={
                  isActive
                    ? `hsl(var(--${matchingCategory.color}))`
                    : `hsl(var(--${matchingCategory.color})/0.5)`
                }
                onClick={() => handlePieSectionClick(matchingCategory)}
                className="cursor-pointer transition-colors duration-200 hover:opacity-90"
              />
            );
          })}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  payload,
  isActive,
  handlePieSectionClick,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  payload: CategoryBreakdown;
  isActive: boolean;
  handlePieSectionClick: (category: Category) => void;
}) => {
  if (!payload) return null;

  const matchingCategory = categories.find((c) => c.type === payload.type);
  if (!matchingCategory) return null;

  const RADIAN = Math.PI / 180;
  const radius = outerRadius * (isActive ? 1.3 : 1.2);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const percentage = (percent * 100).toFixed(1);
  const textClasses = "select-none text-center";

  return (
    <g>
      <image
        href={matchingCategory.icon}
        x={x - 20}
        y={y - 20}
        width={40}
        height={40}
        onClick={() => handlePieSectionClick(matchingCategory)}
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
            {payload.consumptionInLiters} L
          </text>
        </>
      )}
    </g>
  );
};
