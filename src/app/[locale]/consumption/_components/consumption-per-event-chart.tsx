import { useEffect } from "react";

import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

import { ConsumptionBar } from "@app/_components/consumption-bar";
import { EventBar } from "@app/_components/event-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@app/_components/ui/accordion";
import { Skeleton } from "@app/_components/ui/skeleton";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";
import { Category, categories, categoryMap } from "@domain/entities/category";
import { TimeWindow } from "@domain/entities/consumption";
import { ErrorKey } from "@domain/entities/errors";
import { Event } from "@domain/entities/event";

type Props = {
  selectedCategories: Category[] | undefined;
  selectedTimeWindow: TimeWindow | undefined;
};

export function ConsumptionPerEventChart({ selectedCategories, selectedTimeWindow }: Props) {
  const t = useTranslations("consumption-per-event-chart");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("common.errors");

  const { selectedHouseholdId } = useHouseholdStore();

  const { ref, inView } = useInView({
    threshold: 1,
  });

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error: queryError,
    isError,
  } = trpc.event.getEventsSortedByConsumption.useInfiniteQuery(
    {
      householdId: selectedHouseholdId,
      startDate: selectedTimeWindow ? selectedTimeWindow.startDate : new Date(),
      endDate: selectedTimeWindow ? selectedTimeWindow.endDate : new Date(),
      categories: selectedCategories || undefined,
      limit: 10,
    },
    {
      enabled: !!selectedHouseholdId && !!selectedTimeWindow,
      initialCursor: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const events = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError && queryError) {
    const errorMessageKey = queryError.message as ErrorKey;
    return (
      <div className="text-destructive flex items-center justify-center p-6">
        {tErrors(errorMessageKey) || tErrors("unknown-error" as ErrorKey)}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-muted-foreground max-w-md text-center text-sm">{t("no-events-found")}</p>
      </div>
    );
  }

  const displayMode = selectedCategories?.length === 1 ? "accordion" : "list";
  const singleSelectedCategory = selectedCategories?.[0];

  if (displayMode === "list" || !singleSelectedCategory || singleSelectedCategory in categories) {
    const maxConsumption = events[0]?.consumptionInLiters || 1;
    return (
      <div className="space-y-4">
        {events.map((event) => (
          <EventBar key={event.id} event={event} totalConsumption={maxConsumption} />
        ))}
        {(hasNextPage || isLoading || isFetchingNextPage) && (
          <div ref={ref} className="py-4 text-center">
            {isLoading || isFetchingNextPage ? tCommon("loading") : tCommon("loading")}...
          </div>
        )}
        {!hasNextPage && (
          <div className="text-muted-foreground py-4 text-center text-sm">
            {tCommon("no-more-events-to-load")}
          </div>
        )}
      </div>
    );
  } else {
    const eventsByTag = events.reduce(
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
      const maxConsumption = events[0]?.consumptionInLiters || 1;
      return (
        <div className="space-y-4">
          {events.map((event) => (
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
