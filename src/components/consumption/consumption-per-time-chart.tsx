"use client";

import React from "react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, Rectangle, XAxis } from "recharts";
import { TimeWindow, Resolution } from "@/types";
import { getDateRangeString } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const chartConfig = {
  consumption: {
    label: "consum",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type CustomProps = {
  x?: number;
  y?: number;
  payload?: any;
  width?: number;
  height?: number;
  fill: string;
  onClick: (value?: any) => void;
  isSelected?: boolean;
};

const CustomTick = ({ x, y, payload, onClick, isSelected }: CustomProps) => (
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
        x1={-5}
        y1={19}
        x2={5}
        y2={19}
        radius={2}
        stroke="hsl(var(--brand-secondary))"
        strokeWidth={4}
      />
    )}
  </g>
);

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
  const handleClick = (clickedTimeWindow: TimeWindow) => {
    console.log(clickedTimeWindow);
    setTimeWindow(clickedTimeWindow);
  };

  const handleLabelClick = (label: string) => {
    const clickedEntry = data.find(
      (entry) =>
        getDateRangeString(
          entry.timeWindow.startDate,
          entry.timeWindow.endDate,
          resolution
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Filtra el consum per{" "}
          {resolution === "day"
            ? "dia"
            : resolution === "week"
            ? "setmana"
            : "mes"}
          .
        </CardTitle>
        <CardDescription>
          Selecciona una de les barres o etiquetes per veure el consum.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} barSize={30}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={(entry) =>
                getDateRangeString(
                  entry.timeWindow.startDate,
                  entry.timeWindow.endDate,
                  resolution
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
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
