import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { Category, categoryMap } from "@domain/entities/category";
import { ErrorKey } from "@domain/entities/error";
import { Event } from "@domain/entities/event";
import { ConsumptionBar } from "@presentation/components/consumption-bar";
import { EventBar } from "@presentation/components/event-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@presentation/components/ui/accordion";
import { Skeleton } from "@presentation/components/ui/skeleton";
import { getEvents } from "@presentation/lib/actions";
import { TimeWindow } from "@presentation/lib/types";
import { useHouseholdStore } from "@presentation/stores/household";

type Props = {
  selectedCategories: Category[] | undefined;
  selectedTimeWindow: TimeWindow | null;
};

export function ConsumptionPerEventChart({ selectedCategories, selectedTimeWindow }: Props) {
  const t = useTranslations("consumption-per-event-chart");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("common.errors");

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState<ErrorKey | undefined>(undefined);

  const { selectedHouseholdId } = useHouseholdStore();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedTimeWindow || !selectedHouseholdId) {
        setEvents([]);
        // Set loading to false only if we are not expecting a fetch later
        if (!selectedTimeWindow || !selectedHouseholdId) {
          setIsLoadingEvents(false);
        }
        return;
      }

      setIsLoadingEvents(true);
      setErrorEvents(undefined);

      const eventsResult = await getEvents(
        selectedHouseholdId,
        selectedTimeWindow.startDate,
        selectedTimeWindow.endDate
      );

      if (eventsResult.success) {
        setEvents(eventsResult.data);
      } else {
        setErrorEvents(eventsResult.error);
        setEvents([]);
      }
      setIsLoadingEvents(false);
    };

    // Reset loading state when dependencies change before fetching
    setIsLoadingEvents(true);
    fetchEvents();
  }, [selectedHouseholdId, selectedTimeWindow]);

  if (isLoadingEvents) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (errorEvents) {
    return (
      <div className="text-destructive flex items-center justify-center p-6">
        {tErrors(errorEvents)}
      </div>
    );
  }

  const hasCategories = selectedCategories && selectedCategories.length > 0;
  const filteredEvents = hasCategories
    ? events.filter((event) => selectedCategories.some((category) => category === event.category))
    : events;

  if (filteredEvents.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-muted-foreground max-w-md text-center text-sm">{t("no-events-found")}</p>
      </div>
    );
  }

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => b.consumptionInLiters - a.consumptionInLiters
  );

  const displayMode = selectedCategories?.length === 1 ? "accordion" : "list";
  const singleSelectedCategory = selectedCategories?.[0];

  if (
    displayMode === "list" ||
    !singleSelectedCategory ||
    !(singleSelectedCategory in categoryMap)
  ) {
    const maxConsumption = sortedEvents[0]?.consumptionInLiters || 1;
    return (
      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <EventBar key={event.id} event={event} totalConsumption={maxConsumption} />
        ))}
      </div>
    );
  } else {
    const eventsByTag = sortedEvents.reduce(
      (acc, event) => {
        const tagName = event.tag || tCommon("untagged");
        if (!acc[tagName]) acc[tagName] = { events: [], consumption: 0 };
        acc[tagName].events.push(event);
        acc[tagName].consumption += event.consumptionInLiters;
        return acc;
      },
      {} as Record<string, { events: Event[]; consumption: number }>
    );

    if (Object.keys(eventsByTag).length <= 1) {
      const maxConsumption = sortedEvents[0]?.consumptionInLiters || 1;
      return (
        <div className="space-y-4">
          {sortedEvents.map((event) => (
            <EventBar key={event.id} event={event} totalConsumption={maxConsumption} />
          ))}
        </div>
      );
    }

    const sortedTags = Object.entries(eventsByTag).sort(
      ([, a], [, b]) => b.consumption - a.consumption
    );

    const maxTagConsumption = sortedTags[0]?.[1].consumption || 1;

    return (
      <div className="space-y-6">
        <Accordion type="multiple" className="mb-6 w-full">
          {sortedTags.map(([tag, { events: tagEvents, consumption }]) => (
            <AccordionItem className="border-0" key={tag} value={tag}>
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex w-full flex-col items-center gap-1">
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{tag}</span>
                    <span>
                      {consumption.toFixed(1)} L / {tagEvents.length}{" "}
                      {tagEvents.length === 1 ? tCommon("use") : tCommon("uses")}
                    </span>
                  </div>
                  <ConsumptionBar
                    color={categoryMap[singleSelectedCategory].color}
                    consumptionPercentage={(consumption / maxTagConsumption) * 100}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-8">
                <div className="space-y-4 pt-2">
                  {tagEvents
                    .sort((a, b) => b.consumptionInLiters - a.consumptionInLiters)
                    .map((event) => (
                      <EventBar
                        key={event.id}
                        event={event}
                        totalConsumption={tagEvents[0].consumptionInLiters || 1}
                      />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  }
}
