"use client";

import { useState, useEffect } from "react";

import Image from "next/image";

import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { InfiniteCarouselNext } from "@app/[locale]/actions/_components/infinite-carousel-next";
import { useInfiniteCarousel } from "@app/[locale]/actions/_hooks/use-infinite-carousel";
import { Card, CardContent } from "@app/_components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@app/_components/ui/carousel";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";
import { categoryMap } from "@domain/entities/category";
import { Event } from "@domain/entities/event";

import { InfiniteCarouselPrev } from "./infinite-carousel-prev";

interface LeakEventsCarouselProps {
  onDataStatusChange: (hasData: boolean) => void;
}

export function LeakEventsCarousel({ onDataStatusChange }: LeakEventsCarouselProps) {
  const { selectedHouseholdId } = useHouseholdStore();
  const [leakEventsApi, setLeakEventsApi] = useState<CarouselApi>();

  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);

  const tActions = useTranslations("actions");
  const tCategories = useTranslations("common.categories");

  const {
    data: leakEventsData,
    isLoading: isLoadingLeakEvents,
    isFetchingNextPage: isFetchingNextLeakEvents,
    fetchNextPage: fetchNextLeakEvents,
    hasNextPage: hasNextLeakEvents,
  } = trpc.event.getLeakEvents.useInfiniteQuery(
    {
      householdId: selectedHouseholdId!,
      limit: 10,
    },
    {
      enabled: !!selectedHouseholdId,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const leakEvents = leakEventsData?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (!isLoadingLeakEvents) {
      onDataStatusChange(leakEvents.length > 0);
    }
  }, [isLoadingLeakEvents, leakEvents.length, onDataStatusChange]);

  useInfiniteCarousel({
    api: leakEventsApi,
    dataLength: leakEvents.length,
    hasNextPage: hasNextLeakEvents,
    isFetchingNextPage: isFetchingNextLeakEvents,
    fetchNextPage: fetchNextLeakEvents,
  });

  return (
    <>
      {!isLoadingLeakEvents && leakEvents.length > 0 ? (
        <>
          <Carousel setApi={setLeakEventsApi} className="flex w-full max-w-xl flex-row gap-2">
            <InfiniteCarouselPrev className="rounded-lg" />
            <CarouselContent>
              {leakEvents.map((event: Event) => (
                <CarouselItem key={event.id}>
                  <Card>
                    <CardContent className="flex flex-col gap-2 p-6">
                      <Image
                        src={categoryMap[event.category].icon!}
                        alt={event.category}
                        height={48}
                        width={48}
                      />
                      <span className="font-semibold">{tCategories(event.category)}</span>
                      <div className="flex flex-col">
                        <span>{event.startTimestamp.toISOString()}</span>
                        <span>
                          {format(new Date(event.startTimestamp), "HH:mm", {
                            locale: dateFnsLocale,
                          })}{" "}
                          -{" "}
                          {format(new Date(event.endTimestamp), "HH:mm", {
                            locale: dateFnsLocale,
                          })}
                        </span>
                      </div>
                      <span className="font-bold">{event.consumptionInLiters} L</span>
                      {event.notes && event.notes.length > 0 && (
                        <div className="mt-2 flex flex-col gap-1">
                          <span className="font-semibold">Notes:</span>
                          <ul className="list-disc pl-5">
                            {event.notes.map((note, noteIndex) => (
                              <li key={noteIndex}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <InfiniteCarouselNext
              isFetchingNextPage={isFetchingNextLeakEvents}
              hasNextPage={hasNextLeakEvents}
              className="grow rounded-lg"
            />
          </Carousel>
        </>
      ) : (
        !isLoadingLeakEvents && <div>{tActions("no-leaks")}</div>
      )}
    </>
  );
}
