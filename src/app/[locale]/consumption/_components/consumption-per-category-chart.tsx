import { Cell, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { categories, Category } from "@core/entities/category";
import { CategoryBreakdown } from "@core/entities/consumption";
import { ChartConfig, ChartContainer } from "@components/ui/chart";

type Props = {
  category: Category | undefined;
  setCategory: (category: Category | undefined) => void;
  categoryBreakdown: CategoryBreakdown[];
};

const chartConfig: ChartConfig = categories.reduce((config: ChartConfig, category) => {
  config[category.type] = {
    label: category.type,
    color: category.color,
  };
  return config;
}, {});

export function ConsumptionPerCategoryChart({ category, setCategory, categoryBreakdown }: Props) {
  const activeType = category?.type;

  const handlePieSectionClick = (clickedType: string) => {
    const clickedCategory = categories.find((c) => c.type === clickedType);
    if (clickedCategory) {
      setCategory(category?.type === clickedType ? undefined : clickedCategory);
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
          activeIndex={categoryBreakdown.findIndex((item) => item.type === activeType)}
          isAnimationActive={false}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
          labelLine={false}
          label={(props) =>
            renderCustomizedLabel({
              ...props,
              activeType,
              handlePieSectionClick,
            })
          }
          paddingAngle={2}
        >
          {categoryBreakdown.map((item) => {
            const matchingCategory = categories.find((c) => c.type === item.type);
            if (!matchingCategory) return null;

            const isActive = activeType === item.type;

            return (
              <Cell
                key={item.type}
                fill={
                  isActive
                    ? `hsl(var(--${matchingCategory.color}))`
                    : `hsl(var(--${matchingCategory.color})/0.5)`
                }
                onClick={() => handlePieSectionClick(item.type)}
                className="cursor-pointer"
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
  activeType,
  handlePieSectionClick,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  payload: CategoryBreakdown;
  activeType: string | undefined;
  handlePieSectionClick: (type: string) => void;
}) => {
  if (!payload) return null;

  const matchingCategory = categories.find((c) => c.type === payload.type);
  if (!matchingCategory) return null;

  const isActive = payload.type === activeType;
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
        onClick={() => handlePieSectionClick(payload.type)}
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
