import { useEffect } from "react";

import { format, isToday, isYesterday } from "date-fns";
import { LoaderCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

import { EventBar } from "@presentation/components/event-bar";
import { getDateFnsLocale } from "@presentation/i18n/routing";
import { trpc } from "@presentation/lib/trpc";
import { useHouseholdStore } from "@presentation/stores/household";

const NUMBER_OF_DAYS = 2;

export function EventsList() {
  const { selectedHouseholdId } = useHouseholdStore();

  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);
  const tCommon = useTranslations("common");

  const { ref, inView } = useInView({
    threshold: 1,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    trpc.event.getPaginatedEventsGroupedByDay.useInfiniteQuery(
      {
        sensorId: selectedHouseholdId,
        numberOfDays: NUMBER_OF_DAYS,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: new Date().toISOString(),
        enabled: !!selectedHouseholdId,
      }
    );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    <LoaderCircle className="animate-spin" />;
  }

  if (error) {
    return <div> Hey theres an error {error.message} </div>;
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

  // Flatten the data from pages for rendering
  const eventsGroupedByDays = data?.pages.flatMap((page) => page.data) || [];

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
      {(hasNextPage || isLoading || isFetchingNextPage) && (
        <div ref={ref} className="py-4 text-center">
          {isLoading || isFetchingNextPage ? tCommon("loading") : tCommon("loading")}...
        </div>
      )}
      {!hasNextPage && eventsGroupedByDays.length > 0 && (
        <div className="text-muted-foreground py-4 text-center text-sm">
          {tCommon("no-more-events-to-load")}
        </div>
      )}
    </div>
  );
}
