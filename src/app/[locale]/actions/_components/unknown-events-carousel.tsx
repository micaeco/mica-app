import { useState } from "react";

import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { InfiniteCarouselNext } from "@app/[locale]/actions/_components/infinite-carousel-next";
import { InfiniteCarouselPrev } from "@app/[locale]/actions/_components/infinite-carousel-prev";
import { useInfiniteCarousel } from "@app/[locale]/actions/_hooks/use-infinite-carousel";
import { EditEventForm } from "@app/_components/edit-event-form";
import { Card, CardContent, CardDescription } from "@app/_components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@app/_components/ui/carousel";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";
import { Event } from "@domain/entities/event";

export function UnknownEventsCarousel() {
  const { selectedHouseholdId } = useHouseholdStore();

  const [unknownEventsApi, setUnknownEventsApi] = useState<CarouselApi>();

  const utils = trpc.useUtils();

  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);

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
                    <CardContent className="flex flex-col gap-2 pt-6">
                      <span className="font-medium">{tCommon("event")}</span>
                      {event && (
                        <CardDescription>
                          {format(event.startTimestamp, "cccc PPP", { locale: dateFnsLocale })}
                          <br />
                          {format(event.startTimestamp, "HH:mm:ss", {
                            locale: dateFnsLocale,
                          })}{" "}
                          -{" "}
                          {event.endTimestamp
                            ? format(event.endTimestamp, "HH:mm:ss", { locale: dateFnsLocale })
                            : tCommon("in-progress")}
                          <p className="text-brand-secondary py-4 font-bold">
                            {event.consumptionInLiters.toFixed(1)} L
                          </p>
                        </CardDescription>
                      )}

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
        !isLoadingUnknownEvents && <div> {tActions("no-unknowns")}</div>
      )}
    </>
  );
}
