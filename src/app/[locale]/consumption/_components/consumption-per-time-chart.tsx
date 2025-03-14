"use client";

import { useLocale } from "next-intl";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, LabelProps } from "recharts";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";

import { Consumption } from "@core/entities/consumption";
import { ChartConfig, ChartContainer } from "@components/ui/chart";
import { TimeWindow, ConsumptionResolution } from "@lib/types";
import { cn, formatDateRange } from "@lib/utils";

const chartConfig = {
  consumption: {
    label: "consum",
    color: "chart-2",
  },
} satisfies ChartConfig;

type Props = {
  selectedTimeWindow: TimeWindow;
  setSelectedTimeWindow: (timeWindow: TimeWindow) => void;
  resolution: ConsumptionResolution;
  consumption: Consumption[];
  moveTimeWindow: (direction: "forward" | "back") => void;
  canMoveTimeWindowForward: () => boolean;
  isLoading: boolean;
};

export function ConsumptionPerTimeChart({
  selectedTimeWindow,
  setSelectedTimeWindow,
  resolution,
  consumption,
  moveTimeWindow,
  canMoveTimeWindowForward,
  isLoading,
}: Props) {
  const locale = useLocale();

  const handleClick = (clickedTimeWindow: TimeWindow) => {
    setSelectedTimeWindow(clickedTimeWindow);
  };

  const handleLabelClick = (label: string) => {
    const clickedEntry = consumption.find(
      (entry) => formatDateRange(entry.startDate, entry.endDate, resolution, locale) === label
    );
    if (clickedEntry) {
      handleClick(clickedEntry);
    }
  };

  const isSelected = (entry: Consumption) =>
    entry.startDate.getHours() === selectedTimeWindow?.startDate?.getHours() &&
    entry.startDate.getDate() === selectedTimeWindow?.startDate?.getDate() &&
    entry.endDate.getDate() === selectedTimeWindow?.endDate?.getDate() &&
    entry.startDate.getMonth() === selectedTimeWindow?.startDate?.getMonth() &&
    entry.endDate.getFullYear() === selectedTimeWindow?.endDate?.getFullYear();

  if (isLoading) {
    return (
      <div className="aspect-13/9 w-full">
        <div className="flex h-full items-center justify-center">
          <LoaderCircle size={64} className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center">
      <ChevronLeft onClick={() => moveTimeWindow("back")} />

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
                key={`cell-${index}`}
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
        className={cn(!canMoveTimeWindowForward() && "opacity-0")}
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
    <text x={0} y={0} dy={12} textAnchor="middle" fill="#666" style={{ cursor: "pointer" }}>
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

  return (
    <>
      {isSelected && (
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
            {value} L
          </text>
        </g>
      )}
    </>
  );
};
