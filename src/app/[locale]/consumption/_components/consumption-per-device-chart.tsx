import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Event, Category, TimeWindow } from "@/lib/types";
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
    <div className="bg-muted relative h-4 w-full rounded-full">
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
  category: Category | undefined;
};

export default function ConsumptionPerDeviceChart({ timeWindow, category, events }: Props) {
  const common = useTranslations("common");

  const { devices, maxConsumption } = category
    ? getDevices(events, timeWindow, category)
    : getDevices(events, timeWindow);

  return (
    <div className="space-y-8">
      {devices.map((device, index) => (
        <div key={index} className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src={device.category.icon} alt={device.category.name} width={35} height={35} />
              <span className="mr-2">{device.name}</span>
            </div>
            <div className="space-x-2">
              <span className="font-bold">{device.consumption}L</span>
              <span>/</span>
              <span>
                {device.uses} {common("uses")}
              </span>
            </div>
          </div>
          <ProgressBar
            consumption={device.consumption}
            limit={maxConsumption}
            color={device.category.color}
          />
        </div>
      ))}
    </div>
  );
}
