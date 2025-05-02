import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { useLocale, useTranslations } from "next-intl";
import { format, isToday, isYesterday } from "date-fns";

import { EventsForDay } from "@domain/entities/event";
import { useHouseholdStore } from "@presentation/stores/household";
import { getPaginatedEventsGroupedByDay } from "@presentation/lib/actions";
import { getDateFnsLocale } from "@presentation/lib/utils";
import { EventBar } from "@presentation/components/event-bar";

const NUMBER_OF_EVENTS = 20;

export function EventsList() {
  const [eventsGroupedByDays, setEventsGroupedByDays] = useState<EventsForDay[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { ref, inView } = useInView();

  const { selectedHouseholdId } = useHouseholdStore();

  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);

      try {
        const result = await getPaginatedEventsGroupedByDay(
          selectedHouseholdId,
          offset,
          NUMBER_OF_EVENTS
        );

        if (!result.success) {
          toast.error(tErrors(result.error));
          return;
        }

        if (
          result.data.length === 0 ||
          result.data.reduce((sum, day) => sum + day.events.length, 0) < NUMBER_OF_EVENTS
        ) {
          setHasMore(false);
        }

        setEventsGroupedByDays((prevGroups) => [...prevGroups, ...result.data]);
        setOffset((currentOffset) => currentOffset + NUMBER_OF_EVENTS);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error(tErrors("INTERNAL_SERVER_ERROR"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHouseholdId, inView, tErrors]);

  useEffect(() => {
    setEventsGroupedByDays([]);
    setOffset(0);
    setHasMore(true);
  }, [selectedHouseholdId]);

  const getDisplayDateKey = (date: Date): string => {
    if (isToday(date)) {
      return tCommon("today");
    } else if (isYesterday(date)) {
      return tCommon("yesterday");
    } else {
      return format(date, "MMMM d, yyyy", { locale: dateFnsLocale });
    }
  };

  return (
    <div className="space-y-6">
      {eventsGroupedByDays.map((day) => (
        <div key={day.date.toISOString()} className="space-y-4">
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
      {(hasMore || isLoading) && (
        <div ref={ref} className="py-4 text-center">
          {tCommon("loading")}...
        </div>
      )}
      {!hasMore && eventsGroupedByDays.length > 0 && (
        <div className="text-muted-foreground py-4 text-center text-sm">No more events to load</div>
      )}
    </div>
  );
}
