import { PersonStanding } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Resolution, TimeWindow } from "@/lib/types";

const PEOPLE = 4;

type Props = {
  data: any[];
  timeWindow: TimeWindow;
  resolution: Resolution;
};

export default function ConsumptionPerPerson({ data, timeWindow }: Props) {
  const t = useTranslations("consumption-per-person");
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
  const consumptionPerPerson = consumption / PEOPLE;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>{t("title")}</CardTitle>
          <PersonStanding className="h-6 w-6 text-gray-300" />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="font-bold">
          {consumptionPerPerson} {common("liters")} / {common("person")}
        </CardTitle>
      </CardContent>
    </Card>
  );
}
