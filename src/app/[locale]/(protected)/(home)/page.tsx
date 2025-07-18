"use client";

import { CirclePlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { ActionCards } from "@app/[locale]/(protected)/(home)/_components/action-cards";
import { ConsumptionTabs } from "@app/[locale]/(protected)/(home)/_components/consumption-tabs";
import { CreateEventSheet } from "@app/[locale]/(protected)/(home)/_components/create-event-sheet";
import { EventsList } from "@app/[locale]/(protected)/(home)/_components/events-list";
import { Card, CardContent, CardHeader, CardTitle } from "@app/_components/ui/card";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";

export default function Home() {
  const tEventsList = useTranslations("events-list");

  const { selectedHouseholdId } = useHouseholdStore();

  const { data: leakEvents, isLoading: isLoadingLeakEvents } =
    trpc.event.getNumberOfLeakEvents.useQuery(
      {
        householdId: selectedHouseholdId,
      },
      {
        enabled: !!selectedHouseholdId,
      }
    );

  const { data: unknownEvents, isLoading: isLoadingUnknownEvents } =
    trpc.event.getNumberOfUnknownEvents.useQuery(
      {
        householdId: selectedHouseholdId,
      },
      {
        enabled: !!selectedHouseholdId,
      }
    );

  return (
    <div className="flex flex-col gap-4 p-4 xl:h-[calc(100svh-var(--navbar-height)-var(--header-height))] xl:flex-row">
      <div className="flex flex-col gap-4">
        {leakEvents || unknownEvents ? (
          <ActionCards
            leakEvents={leakEvents}
            isLoadingLeakEvents={isLoadingLeakEvents}
            unknownEvents={unknownEvents}
            isLoadingUnknownEvents={isLoadingUnknownEvents}
          />
        ) : null}

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
            <CreateEventSheet>
              <CirclePlus className="cursor-pointer" />
            </CreateEventSheet>
          </CardTitle>
        </CardHeader>
        <CardContent className="xl:flex-1 xl:overflow-y-auto">
          <EventsList />
        </CardContent>
      </Card>
    </div>
  );
}
