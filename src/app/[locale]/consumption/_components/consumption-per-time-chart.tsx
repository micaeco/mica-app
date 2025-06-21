"use client";

import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, LabelProps } from "recharts";

import { ChartConfig, ChartContainer } from "@app/_components/ui/chart";
import { cn, formatDateRange } from "@app/_lib/utils";
import { Consumption, Granularity, TimeWindow } from "@domain/entities/consumption";
import { ErrorKey } from "@domain/entities/errors";

const chartConfig = {
  consumption: {
    label: "consum",
    color: "chart-2",
  },
} satisfies ChartConfig;

type Props = {
  selectedTimeWindow: TimeWindow | undefined;
  setSelectedTimeWindow: (timeWindow: TimeWindow) => void;
  resolution: Granularity;
  consumption: Consumption[];
  moveTimeWindow: (direction: "forward" | "back") => void;
  canMoveTimeWindowForward: () => boolean;
  isLoading: boolean;
  error?: ErrorKey;
};

export function ConsumptionPerTimeChart({
  selectedTimeWindow,
  setSelectedTimeWindow,
  resolution,
  consumption,
  moveTimeWindow,
  canMoveTimeWindowForward,
  isLoading,
  error,
}: Props) {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("common.errors");

  const handleClick = (clickedConsumptionItem: Consumption) => {
    setSelectedTimeWindow({
      startDate: clickedConsumptionItem.startDate,
      endDate: clickedConsumptionItem.endDate,
    });
  };

  const handleLabelClick = (tag: string) => {
    const clickedEntry = consumption.find(
      (entry) => formatDateRange(entry.startDate, entry.endDate, resolution, locale) === tag
    );
    if (clickedEntry) {
      handleClick(clickedEntry);
    }
  };

  const isSelected = (entry: Consumption) =>
    selectedTimeWindow !== undefined &&
    entry.startDate.getTime() === selectedTimeWindow.startDate.getTime() &&
    entry.endDate.getTime() === selectedTimeWindow.endDate.getTime();

  if (isLoading) {
    return <LoaderCircle className="animate-spin" />;
  }

  if (error) {
    return (
      <div className="text-destructive flex h-[350px] w-full items-center justify-center">
        {tErrors(error)}
      </div>
    );
  }

  if (consumption.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[350px] w-full items-center justify-center">
        {tCommon("no-data")}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-row items-center">
      <ChevronLeft
        onClick={() => moveTimeWindow("back")}
        className="text-muted-foreground hover:text-foreground cursor-pointer"
      />

      <ChartContainer config={chartConfig} className="w-full">
        <BarChart
          data={consumption}
          barSize={30}
          margin={{ top: 25, bottom: 10, left: 10, right: 10 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={(entry) => formatDateRange(entry.startDate, entry.endDate, resolution, locale)}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            interval={0}
            tick={(props) => (
              <CustomTick
                {...props}
                onClick={handleLabelClick}
                isSelected={props.index !== undefined && isSelected(consumption[props.index])}
              />
            )}
          />
          <Bar dataKey="consumptionInLiters" radius={20}>
            {consumption.map((entry, index) => (
              <Cell
                key={`cell-${index}-${entry.startDate.toISOString()}`}
                fill={
                  isSelected(entry)
                    ? "hsl(var(--brand-secondary))"
                    : "hsl(var(--brand-secondary) / 0.2)"
                }
                onClick={() => handleClick(entry)}
                className="cursor-pointer transition-all duration-300 ease-in-out hover:opacity-80"
              />
            ))}
            <LabelList
              dataKey="consumptionInLiters"
              content={(props: LabelProps & { index?: number }) =>
                renderCustomizedLabel({
                  x: Number(props.x) || 0,
                  y: Number(props.y) || 0,
                  width: Number(props.width) || 0,
                  value: Number(props.value) || 0,
                  isSelected:
                    props.index !== undefined ? isSelected(consumption[props.index]) : false,
                })
              }
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChevronRight
        onClick={() => moveTimeWindow("forward")}
        className={cn(
          "text-muted-foreground hover:text-foreground cursor-pointer",
          !canMoveTimeWindowForward() && "pointer-events-none opacity-30"
        )}
      />
    </div>
  );
}

const CustomTick = ({
  x,
  y,
  payload,
  onClick,
  isSelected,
}: {
  x: number;
  y: number;
  payload: { value: string };
  onClick: (value: string) => void;
  isSelected: boolean;
}) => (
  <g transform={`translate(${x},${y})`} onClick={() => onClick(payload.value)}>
    <text
      x={0}
      y={0}
      dy={12}
      textAnchor="middle"
      fill="#666"
      style={{ cursor: "pointer" }}
      fontSize={12}
    >
      {payload.value}
    </text>
    {isSelected && (
      <line
        x1={-10}
        y1={19}
        x2={10}
        y2={19}
        radius={2}
        stroke="hsl(var(--brand-secondary))"
        strokeWidth={2}
      />
    )}
  </g>
);

const renderCustomizedLabel = (props: {
  x: number;
  y: number;
  width: number;
  value: number;
  isSelected: boolean;
}) => {
  const { x, y, width, value, isSelected } = props;
  const radius = 10;

  if (!isSelected) {
    return null;
  }

  return (
    <g>
      <text
        x={x + width / 2}
        y={y - radius - 5}
        fill="hsl(var(--brand-secondary))"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
        className="text-sm"
      >
        {value.toFixed(0)} L
      </text>
    </g>
  );
};
