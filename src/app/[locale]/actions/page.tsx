"use client";

import { useState } from "react";

import Image from "next/image";

import { format, isToday, isYesterday } from "date-fns";
import { Bell, ChevronDown, CircleCheck, HelpCircle, LoaderCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@app/_components/ui/accordion";
import { Card, CardContent } from "@app/_components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@app/_components/ui/carousel";
import { ToggleGroup, ToggleGroupItem } from "@app/_components/ui/toggle-group";
import { getDateFnsLocale } from "@app/_i18n/routing";
import { trpc } from "@app/_lib/trpc";
import { useHouseholdStore } from "@app/_stores/household";
import { categories, Category, categoryMap } from "@domain/entities/category";
import { Event } from "@domain/entities/event";

export default function Actions() {
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const { selectedHouseholdId } = useHouseholdStore();

  const tActions = useTranslations("actions");
  const tCategories = useTranslations("common.categories");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);

  const filteredCategories = categories.filter(
    (category) => category !== "rest" && category !== "unknown"
  );

  const { data: leakEventsData, isLoading: isLoadingLeakEvents } =
    trpc.event.getLeakEvents.useQuery(
      { householdId: selectedHouseholdId! },
      {
        enabled: !!selectedHouseholdId,
      }
    );
  const leakEvents = leakEventsData ?? [];

  const { data: unknownEventsData, isLoading: isLoadingUnknownEvents } =
    trpc.event.getUnknownEvents.useQuery(
      { householdId: selectedHouseholdId! },
      {
        enabled: !!selectedHouseholdId,
      }
    );
  const unknownEvents = unknownEventsData ?? [];

  function formatDate(dateInput: Date | string | number) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isToday(date)) {
      return tCommon("today");
    } else if (isYesterday(date)) {
      return tCommon("yesterday");
    }
    return format(date, "MMMM d, yyyy", { locale: dateFnsLocale });
  }

  return (
    <div className="p-4">
      <Accordion type="multiple" defaultValue={["leakEvents", "unknownEvents"]}>
        <AccordionItem className="border-0" value="leakEvents">
          <AccordionTrigger
            className="py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180"
            Icon={ChevronDown}
            iconOnRight
          >
            <div className="flex gap-2 font-semibold">
              <Bell /> {tCommon("leaks")}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {isLoadingLeakEvents && <LoaderCircle className="animate-spin" />}
            {!isLoadingLeakEvents && leakEvents.length > 0 ? (
              <Carousel className="ml-10 w-full max-w-3xs sm:max-w-xs md:max-w-sm lg:max-w-md">
                <CarouselPrevious className="h-full rounded-lg" />
                <CarouselContent>
                  {leakEvents.map((event: Event, index: number) => (
                    <CarouselItem key={index}>
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
                            <span>{formatDate(event.startTimestamp)}</span>
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
                <CarouselNext className="h-full rounded-lg" />
              </Carousel>
            ) : (
              !isLoadingLeakEvents && <div>{tActions("no-leaks")}</div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem className="border-0" value="unknownEvents">
          <AccordionTrigger
            className="py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180"
            Icon={ChevronDown}
            iconOnRight
          >
            <div className="flex gap-2 font-semibold">
              <HelpCircle /> {tCommon("categorize")}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {isLoadingUnknownEvents && <LoaderCircle className="animate-spin" />}
            {!isLoadingUnknownEvents && unknownEvents.length > 0 ? (
              <Carousel className="ml-10 w-full max-w-3xs sm:max-w-xs md:max-w-sm lg:max-w-md">
                <CarouselPrevious className="h-full rounded-lg" />
                <CarouselContent>
                  {unknownEvents.map((event: Event, index: number) => (
                    <CarouselItem key={index}>
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
                            <span>{formatDate(event.startTimestamp)}</span>
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
                          <span className="text-brand-secondary font-bold">
                            {event.consumptionInLiters.toFixed(2)} L
                          </span>
                          <div className="flex flex-col gap-2">
                            <span> Punt de consum </span>
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
                <CarouselNext className="h-full rounded-lg" />
              </Carousel>
            ) : (
              !isLoadingUnknownEvents && <div> {tActions("no-unknowns")}</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
