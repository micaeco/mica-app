import { useEffect } from "react";

import { format, isToday, isYesterday } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

import { EventBar } from "@app/_components/event-bar";
import { Skeleton } from "@app/_components/ui/skeleton";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";

export function EventsList() {
  const { selectedHouseholdId } = useHouseholdStore();

  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);
  const tCommon = useTranslations("common");

  const { ref, inView } = useInView({
    threshold: 1,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    trpc.event.getEventsGroupedByDay.useInfiniteQuery(
      {
        householdId: selectedHouseholdId,
        limit: 20,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: undefined,
        enabled: !!selectedHouseholdId,
      }
    );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="space-y-4 pl-2">
            {Array.from({ length: 4 }).map((_, eventIndex) => (
              <Skeleton key={eventIndex} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getDisplayDateKey = (date: Date): string => {
    if (isToday(date)) {
      return tCommon("today");
    } else if (isYesterday(date)) {
      return tCommon("yesterday");
    } else {
      return format(date, "MMMM d, yyyy", { locale: dateFnsLocale });
    }
  };

  const eventsGroupedByDays = data?.pages.flatMap((page) => page.data) || [];

  if (eventsGroupedByDays.length === 0) {
    return (
      <div className="text-muted-foreground py-4 text-center text-sm">{tCommon("no-data")}</div>
    );
  }

  return (
    <div className="space-y-6">
      {eventsGroupedByDays.map((day) => (
        <div key={day.date.toISOString() + day.totalConsumption.toString()} className="space-y-4">
          <div className="text-muted-foreground flex items-center justify-between text-sm font-light">
            <p>{getDisplayDateKey(day.date)}:</p>
            <p>{day.totalConsumption.toFixed(1)} L</p>
          </div>
          <div className="space-y-4 pl-2">
            {day.events.map((event) => (
              <EventBar key={event.id} event={event} totalConsumption={day.totalConsumption} />
            ))}
          </div>
        </div>
      ))}
      {(hasNextPage || isFetchingNextPage) && (
        <div ref={ref} className="space-y-4 py-4">
          {isFetchingNextPage ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="space-y-4 pl-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ) : null}
        </div>
      )}
      {!hasNextPage && (
        <div className="text-muted-foreground py-4 text-center text-sm">
          {tCommon("no-more-events-to-load")}
        </div>
      )}
    </div>
  );
}
