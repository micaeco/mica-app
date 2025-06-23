import { useState } from "react";

import Image from "next/image";

import { format } from "date-fns";
import { CircleCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent } from "@app/_components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
} from "@app/_components/ui/carousel";
import { ToggleGroup, ToggleGroupItem } from "@app/_components/ui/toggle-group";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";
import { categories, Category, categoryMap } from "@domain/entities/category";
import { Event } from "@domain/entities/event";

import { InfiniteCarouselNext } from "./infinite-carousel-next";
import { useInfiniteCarousel } from "../_hooks/use-infinite-carousel";

export function UnknownEventsCarousel() {
  const { selectedHouseholdId } = useHouseholdStore();

  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [unknownEventsApi, setUnknownEventsApi] = useState<CarouselApi>();

  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);

  const tCommon = useTranslations("common");
  const tActions = useTranslations("actions");
  const tCategories = useTranslations("common.categories");

  const filteredCategories = categories.filter(
    (category) => category !== "rest" && category !== "unknown"
  );

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
          <Carousel
            setApi={setUnknownEventsApi}
            className="flex flex-row gap-2 sm:max-w-xs md:max-w-sm lg:max-w-md"
          >
            <CarouselPrevious className="h-full rounded-lg" />
            <CarouselContent className="h-full">
              {unknownEvents.map((event: Event) => (
                <CarouselItem key={event.id} className="h-full">
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
                        <span>
                          {format(event.startTimestamp, "PPPP", { locale: dateFnsLocale })}
                        </span>
                        <span>
                          {format(new Date(event.startTimestamp), "HH:mm:ss", {
                            locale: dateFnsLocale,
                          })}{" "}
                          -{" "}
                          {format(new Date(event.endTimestamp), "HH:mm:ss", {
                            locale: dateFnsLocale,
                          })}
                        </span>
                      </div>
                      <span className="text-brand-secondary font-bold">
                        {event.consumptionInLiters.toFixed(2)} L
                      </span>
                      <div className="flex flex-col gap-2">
                        <span> {tCommon("consumption-point")} </span>
                        <ToggleGroup
                          type="single"
                          value={selectedCategory}
                          onValueChange={(value) => {
                            if (value) setSelectedCategory(value as Category);
                          }}
                          className="flex flex-wrap gap-2"
                        >
                          {filteredCategories.map((category: Category) => (
                            <ToggleGroupItem
                              className="data-[state=on]:bg-brand-secondary hover:text-primary hover:bg-brand-tertiary rounded-lg bg-gray-200 transition-colors"
                              value={category}
                              key={category}
                            >
                              <Image
                                className="object-contain"
                                src={categoryMap[category].icon!}
                                alt={category}
                                width={24}
                                height={24}
                              />
                              <span className="text-xs">{tCategories(category)}</span>
                              {selectedCategory === category && (
                                <CircleCheck className="ml-2 h-4 w-4" />
                              )}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <InfiniteCarouselNext
              isFetchingNextPage={isFetchingNextUnknownEvents}
              hasNextPage={hasNextUnknownEvents}
              className="h-full rounded-lg"
            />
          </Carousel>
          <div className="mt-4 ml-10 flex h-8 items-center justify-center">
            {!hasNextUnknownEvents && !isFetchingNextUnknownEvents && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CircleCheck className="h-4 w-4" />
                {tActions("no-unknowns")}
              </div>
            )}
          </div>
        </>
      ) : (
        !isLoadingUnknownEvents && <div> {tActions("no-unknowns")}</div>
      )}
    </>
  );
}
