import React from "react";
import { Droplet } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import getHistoricConsumption from "@/lib/utils";
import { Event } from "@/lib/types";

type Props = {
  events: Event[];
};

export default function ConsumptionHistoric({ events }: Props) {
  const t = useTranslations("consumption-historic");

  const historicConsumption = getHistoricConsumption(events);
  const historicConsumptionInM3 = historicConsumption / 1000;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>{t("title")}</CardTitle>
          <Droplet className="h-6 w-6 text-gray-300" />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="font-bold">
          {historicConsumptionInM3} m³
        </CardTitle>
      </CardContent>
    </Card>
  );
}
