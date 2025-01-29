"use client";

import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
} from "recharts";
import { useLocale, useMessages, useTranslations } from "next-intl";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TimeWindow, Resolution } from "@/lib/types";
import { getAverageConsumption, formatDateRange } from "@/lib/utils";
import { useEvents } from "@/hooks/use-events";

const chartConfig = {
  consumption: {
    label: "consum",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const CustomTick = ({
  x,
  y,
  payload,
  onClick,
  isSelected,
}: {
  x: number;
  y: number;
  payload: any;
  onClick: (value: any) => void;
  isSelected: Boolean;
}) => (
  <g transform={`translate(${x},${y})`} onClick={() => onClick(payload.value)}>
    <text
      x={0}
      y={0}
      dy={12}
      textAnchor="middle"
      fill="#666"
      style={{ cursor: "pointer" }}
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

const renderCustomizedLabel = (props: any) => {
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
            font-weight="bold"
            className="text-sm"
          >
            {value} L
          </text>
        </g>
      )}
    </>
  );
};

type Props = {
  timeWindow: TimeWindow;
  setTimeWindow: (timeWindow: TimeWindow) => void;
  resolution: Resolution;
  data: any[];
};

export default function ConsumptionPerTimeChart({
  timeWindow,
  setTimeWindow,
  resolution,
  data,
}: Props) {
  const t = useTranslations("consumption-per-time-chart");
  const common = useTranslations("common");
  const locale = useLocale();
  const { events } = useEvents();
  const [averageConsumption, setAverageConsumption] = useState(
    getAverageConsumption(events, resolution)
  );

  const handleClick = (clickedTimeWindow: TimeWindow) => {
    setTimeWindow(clickedTimeWindow);
  };

  const handleLabelClick = (label: string) => {
    const clickedEntry = data.find(
      (entry) =>
        formatDateRange(
          entry.timeWindow.startDate,
          entry.timeWindow.endDate,
          resolution,
          locale
        ) === label
    );
    if (clickedEntry) {
      handleClick(clickedEntry.timeWindow);
    }
  };

  const isSelected = (entry: any) =>
    entry.timeWindow.startDate.getDate() === timeWindow.startDate.getDate() &&
    entry.timeWindow.endDate.getDate() === timeWindow.endDate.getDate() &&
    entry.timeWindow.startDate.getMonth() === timeWindow.startDate.getMonth() &&
    entry.timeWindow.endDate.getFullYear() === timeWindow.endDate.getFullYear();

  useEffect(() => {
    setAverageConsumption(getAverageConsumption(events, resolution));
  }, [events, resolution]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          {resolution === "personalized"
            ? t("title.personalized")
            : t("title.other", { resolution: common(`${resolution}`) })}
        </CardTitle>
        <CardDescription>
          {resolution === "personalized"
            ? t("description.personalized")
            : t("description.other", { resolution: common(`${resolution}`) })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-13/9 w-full">
          <BarChart
            data={data}
            barSize={30}
            margin={{ top: 25, bottom: 20, left: 10, right: 10 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={(entry) =>
                formatDateRange(
                  entry.timeWindow.startDate,
                  entry.timeWindow.endDate,
                  resolution,
                  locale
                )
              }
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={(props) => (
                <CustomTick
                  {...props}
                  onClick={handleLabelClick}
                  isSelected={isSelected(data[props.index])}
                />
              )}
            />
            <Bar dataKey="consumption" radius={20}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    isSelected(entry)
                      ? "hsl(var(--brand-secondary))"
                      : "hsl(var(--brand-secondary) / 0.2)"
                  }
                  onClick={() => handleClick(entry.timeWindow)}
                  className="transition-all duration-300 ease-in-out hover:opacity-80 cursor-pointer"
                />
              ))}
              <LabelList
                dataKey="consumption"
                content={(props: any) =>
                  renderCustomizedLabel({
                    ...props,
                    isSelected: isSelected(data[props.index]),
                  })
                }
              />
            </Bar>
            {resolution !== "personalized" && (
              <ReferenceLine
                y={averageConsumption}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
              />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
