import { Resolution, TimeWindow } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PersonStanding } from "lucide-react";
import { getDescription } from "@/lib/utils";

const PEOPLE = 4;

type Props = {
  data: any[];
  timeWindow: TimeWindow;
  resolution: Resolution;
};

export default function ConsumptionPerPerson({
  data,
  timeWindow,
  resolution,
}: Props) {
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
  const description = getDescription(timeWindow, resolution);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Consum per persona.</CardTitle>
          <PersonStanding className="h-6 w-6 text-gray-300" />
        </div>
        <CardDescription className="first-letter:capitalize">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle className="font-bold">
          {consumptionPerPerson} litres / persona
        </CardTitle>
      </CardContent>
    </Card>
  );
}
