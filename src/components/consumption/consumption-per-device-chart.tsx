import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Event, Category, Resolution, TimeWindow } from "@/lib/types";
import { getDevices } from "@/lib/utils";

const ProgressBar = ({
  consumption,
  limit,
  color,
}: {
  consumption: number;
  limit: number;
  color: string;
}) => {
  const percentage = Math.min(100, (consumption / limit) * 100);
  return (
    <div className="relative h-4 w-full bg-muted rounded-full">
      <div
        className="absolute h-full rounded-full"
        style={{
          width: `${percentage}%`,
          backgroundColor: `hsl(var(${color}))`,
        }}
      />
    </div>
  );
};

type Props = {
  events: Event[];
  timeWindow: TimeWindow;
  resolution: Resolution;
  category: Category | undefined;
};

export default function ConsumptionPerDeviceChart({
  timeWindow,
  resolution,
  category,
  events,
}: Props) {
  const t = useTranslations("consumption-per-device-chart");

  let { devices, maxConsumption } = category
    ? getDevices(events, timeWindow, category)
    : getDevices(events, timeWindow);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {devices.map((device, index) => (
          <div key={index} className="mb-8">
            <div className="flex justify-between items-baseline mb-2">
              <div className="flex space-x-2 items-center">
                <Image
                  src={device.category.icon}
                  alt={device.category.name}
                  width={35}
                  height={35}
                />
                <span className="mr-2">{device.name}</span>
              </div>
              <div className="space-x-2">
                <span className="font-bold">{device.consumption}L</span>
                <span>/</span>
                <span>{device.uses} usos</span>
              </div>
            </div>
            <ProgressBar
              consumption={device.consumption}
              limit={maxConsumption}
              color={device.category.color}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
