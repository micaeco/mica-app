import { useState } from "react";

import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Cell, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { ChartConfig, ChartContainer } from "@app/_components/ui/chart";
import { categories, Category, categoryMap } from "@domain/entities/category";
import { CategoryBreakdown } from "@domain/entities/consumption";

type Props = {
  setSelectedCategories: (category: Category[] | undefined) => void;
  categoryBreakdown: CategoryBreakdown[];
  isLoading: boolean;
};

const chartConfig: ChartConfig = categories.reduce((config: ChartConfig, category) => {
  config[category] = {
    label: category,
    color: categoryMap[category].color,
  };
  return config;
}, {});

export function ConsumptionPerCategoryChart({
  setSelectedCategories,
  categoryBreakdown,
  isLoading,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<Category | undefined>(undefined);
  const tCommon = useTranslations("common");

  const handlePieSectionClick = (clickedCategory: Category) => {
    if (activeCategory && activeCategory === clickedCategory) {
      setActiveCategory(undefined);
      setSelectedCategories(undefined);
    } else {
      if (clickedCategory === "rest") {
        const restCategories = categories.filter(
          (category) =>
            !categoryBreakdown.some((item) => item.category === category) && category !== "rest"
        );
        setActiveCategory(clickedCategory);
        setSelectedCategories(restCategories.length > 0 ? restCategories : undefined);
      } else {
        setActiveCategory(clickedCategory);
        setSelectedCategories([clickedCategory]);
      }
    }
  };

  if (isLoading) {
    return <LoaderCircle className="animate-spin" />;
  }

  if (categoryBreakdown.length === 0) {
    return (
      <div className="text-muted-foreground flex aspect-13/9 min-h-[280px] w-full items-center justify-center">
        {tCommon("no-data")}
      </div>
    );
  }

  const activeIndex = categoryBreakdown.findIndex((item) => item.category === activeCategory);

  return (
    <ChartContainer config={chartConfig} className="aspect-13/9 min-h-[280px] w-full">
      <PieChart>
        <Pie
          data={categoryBreakdown}
          dataKey="consumptionInLiters"
          nameKey="category"
          outerRadius="70%"
          innerRadius="50%"
          activeIndex={activeIndex}
          isAnimationActive={false}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={Number(outerRadius) + 10} />
          )}
          labelLine={false}
          label={(props) =>
            renderCustomizedLabel({
              ...props,
              payload: props.payload as CategoryBreakdown,
              isActive: props.index === activeIndex,
              handlePieSectionClick,
            })
          }
          paddingAngle={2}
        >
          {categoryBreakdown.map((item) => {
            const categoryInfo = categoryMap[item.category];
            if (!categoryInfo) return null;

            const isActive = activeCategory === item.category;

            return (
              <Cell
                key={item.category}
                fill={
                  isActive
                    ? `hsl(var(--${categoryInfo.color}))`
                    : `hsl(var(--${categoryInfo.color})/0.5)`
                }
                onClick={() => handlePieSectionClick(item.category)}
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
  payload: CategoryBreakdown | null;
  isActive: boolean;
  handlePieSectionClick: (category: Category) => void;
}) => {
  if (!payload || !payload.category) return null;

  const categoryInfo = categoryMap[payload.category];
  if (!categoryInfo) return null;

  const RADIAN = Math.PI / 180;
  const labelRadius = outerRadius * (isActive ? 1.35 : 1.25);
  const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  const percentage = (percent * 100).toFixed(1);
  const textClasses = "select-none text-center";

  return (
    <g>
      {categoryInfo.icon && (
        <image
          href={categoryInfo.icon}
          x={x - 20}
          y={y - 20}
          width={40}
          height={40}
          onClick={() => handlePieSectionClick(payload.category)}
          style={{ cursor: "pointer" }}
        />
      )}
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
            {payload.consumptionInLiters.toFixed(1)} L
          </text>
        </>
      )}
    </g>
  );
};
