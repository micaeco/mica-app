import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { LineChart } from "lucide-react";

import { getDescription } from "@/lib/utils";
import { Resolution, TimeWindow } from "@/types";

type Props = {
  timeWindow: TimeWindow;
  data: any[];
  resolution: Resolution;
};

export default function ConsumptionCard({
  data,
  timeWindow,
  resolution,
}: Props) {
  console.log("Start: ", timeWindow.startDate, " End: ", timeWindow.endDate);
  const consumption = data.find(
    (d) =>
      d.timeWindow.startDate.getDay() === timeWindow.startDate.getDay() &&
      d.timeWindow.endDate.getDay() === timeWindow.endDate.getDay() &&
      d.timeWindow.startDate.getMonth() === timeWindow.startDate.getMonth() &&
      d.timeWindow.endDate.getMonth() === timeWindow.endDate.getMonth() &&
      d.timeWindow.startDate.getFullYear() ===
        timeWindow.startDate.getFullYear() &&
      d.timeWindow.endDate.getFullYear() === timeWindow.endDate.getFullYear()
  )?.consumption;
  const description = getDescription(timeWindow, resolution);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Consum seleccionat.</CardTitle>
          <LineChart className="h-6 w-6 text-gray-300" />
        </div>
        <CardDescription className="first-letter:capitalize">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle className="font-bold">{consumption} litres</CardTitle>
      </CardContent>
    </Card>
  );
}
