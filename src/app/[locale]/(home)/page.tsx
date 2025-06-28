"use client";

import { CirclePlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { ActionCards } from "@app/[locale]/(home)/_components/action-cards";
import { ConsumptionTabs } from "@app/[locale]/(home)/_components/consumption-tabs";
import { LabelEventSheet } from "@app/[locale]/(home)/_components/create-event-sheet";
import { EventsList } from "@app/_components/events-list";
import { Card, CardContent, CardHeader, CardTitle } from "@app/_components/ui/card";

export default function Home() {
  const tEventsList = useTranslations("events-list");

  return (
    <div className="relative flex flex-col gap-4 p-4 xl:h-[calc(100svh-var(--navbar-height)-var(--header-height))] xl:flex-row">
      <div className="flex flex-col gap-4">
        <ActionCards />

        <Card className="flex justify-center">
          <CardContent className="pt-4">
            <ConsumptionTabs />
          </CardContent>
        </Card>
      </div>

      <Card className="w-full xl:flex xl:flex-col xl:overflow-hidden">
        <CardHeader className="xl:flex-shrink-0">
          <CardTitle className="flex flex-row items-center gap-2">
            {tEventsList("title")}
            <LabelEventSheet>
              <CirclePlus className="cursor-pointer" />
            </LabelEventSheet>
          </CardTitle>
        </CardHeader>
        <CardContent className="xl:flex-1 xl:overflow-y-auto">
          <EventsList />
        </CardContent>
      </Card>
    </div>
  );
}
