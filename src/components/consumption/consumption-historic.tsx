import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Droplet } from "lucide-react";

import getHistoricConsumption, {
  getConsumption,
  getDescription,
} from "@/lib/utils";
import { Event, Resolution, TimeWindow } from "@/types";

type Props = {
  timeWindow: TimeWindow;
  events: Event[];
  resolution: Resolution;
};

export default function ConsumptionHistoric({
  timeWindow,
  events,
  resolution,
}: Props) {
  const historicConsumption = getHistoricConsumption(events);
  const historicConsumptionInM3 = historicConsumption / 1000;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Consum històric.</CardTitle>
          <Droplet className="h-6 w-6 text-gray-300" />
        </div>
        <CardDescription>
          Des de que es va instal·lar el sensor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle className="font-bold">
          {historicConsumptionInM3} m³
        </CardTitle>
      </CardContent>
    </Card>
  );
}
