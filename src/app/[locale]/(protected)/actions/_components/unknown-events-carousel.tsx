"use client";

import { useState, useEffect } from "react";

import { useTranslations } from "next-intl";

import { InfiniteCarouselNext } from "@app/[locale]/(protected)/actions/_components/infinite-carousel-next";
import { InfiniteCarouselPrev } from "@app/[locale]/(protected)/actions/_components/infinite-carousel-prev";
import { useInfiniteCarousel } from "@app/[locale]/(protected)/actions/_hooks/use-infinite-carousel";
import { EditEventForm } from "@app/_components/edit-event-form";
import { Card, CardContent, CardHeader, CardTitle } from "@app/_components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@app/_components/ui/carousel";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";
import { Event } from "@domain/entities/event";

interface UnknownEventsCarouselProps {
  onDataStatusChange: (hasData: boolean) => void;
}

export function UnknownEventsCarousel({ onDataStatusChange }: UnknownEventsCarouselProps) {
  const { selectedHouseholdId } = useHouseholdStore();

  const [unknownEventsApi, setUnknownEventsApi] = useState<CarouselApi>();

  const utils = trpc.useUtils();

  const tCommon = useTranslations("common");
  const tActions = useTranslations("actions");

  const {
    data: unknownEventsData,
    isLoading: isLoadingUnknownEvents,
    isFetchingNextPage: isFetchingNextUnknownEvents,
    fetchNextPage: fetchNextUnknownEvents,
    hasNextPage: hasNextUnknownEvents,
  } = trpc.event.getUnknownEvents.useInfiniteQuery(
    {
      householdId: selectedHouseholdId!,
      limit: 10,
    },
    {
      enabled: !!selectedHouseholdId,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const unknownEvents = unknownEventsData?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (!isLoadingUnknownEvents) {
      onDataStatusChange(unknownEvents.length > 0);
    }
  }, [isLoadingUnknownEvents, unknownEvents.length, onDataStatusChange]);

  useInfiniteCarousel({
    api: unknownEventsApi,
    dataLength: unknownEvents.length,
    hasNextPage: hasNextUnknownEvents,
    isFetchingNextPage: isFetchingNextUnknownEvents,
    fetchNextPage: fetchNextUnknownEvents,
  });

  return (
    <>
      {!isLoadingUnknownEvents && unknownEvents.length > 0 ? (
        <>
          <Carousel setApi={setUnknownEventsApi} className="flex w-full max-w-xl flex-row gap-2">
            <InfiniteCarouselPrev className="rounded-lg" />
            <CarouselContent className="h-full">
              {unknownEvents.map((event: Event) => (
                <CarouselItem key={event.id} className="h-full">
                  <Card>
                    <CardHeader>
                      <CardTitle>{tCommon("event")}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      <EditEventForm
                        event={event}
                        onFormSubmitSuccess={() => {
                          utils.event.getUnknownEvents.invalidate();
                        }}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <InfiniteCarouselNext
              isFetchingNextPage={isFetchingNextUnknownEvents}
              hasNextPage={hasNextUnknownEvents}
              className="grow rounded-lg"
            />
          </Carousel>
        </>
      ) : (
        !isLoadingUnknownEvents && <div> {tActions("noUnknowns")}</div>
      )}
    </>
  );
}
