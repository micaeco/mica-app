"use client";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
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
  const handleBarClick = (timeWindow: TimeWindow) => {
    setTimeWindow(timeWindow);
  };

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
          Selecciona una de les barres per veure el consum.
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
            />
            <Bar dataKey="consumption" radius={20}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.timeWindow.startDate.getDate() ===
                      timeWindow.startDate.getDate() &&
                    entry.timeWindow.endDate.getDate() ===
                      timeWindow.endDate.getDate() &&
                    entry.timeWindow.startDate.getMonth() ===
                      timeWindow.startDate.getMonth() &&
                    entry.timeWindow.endDate.getFullYear() ===
                      timeWindow.endDate.getFullYear()
                      ? "hsl(var(--brand-secondary))"
                      : "hsl(var(--brand-secondary) / 0.2)"
                  }
                  onClick={() => handleBarClick(entry.timeWindow)}
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
