import React from "react";
import { LineChart } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Resolution, TimeWindow } from "@/lib/types";

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
  const t = useTranslations("consumption-card");
  const common = useTranslations("common");

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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>{t("title")}</CardTitle>
          <LineChart className="h-6 w-6 text-gray-300" />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="font-bold">
          {consumption} {common("liters")}
        </CardTitle>
      </CardContent>
    </Card>
  );
}
