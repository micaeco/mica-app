"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { format, isToday, isYesterday } from "date-fns";
import { Bell, ChevronDown, CircleCheck, HelpCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { getLeakEvents, getUnknownEvents } from "@app/[locale]/actions/actions";
import { categories, Category, categoryMap } from "@domain/entities/category";
import { Event } from "@domain/entities/event";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@presentation/components/ui/accordion";
import { Card, CardContent } from "@presentation/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@presentation/components/ui/carousel";
import { ToggleGroup, ToggleGroupItem } from "@presentation/components/ui/toggle-group";
import { getDateFnsLocale } from "@presentation/lib/utils";
import { useHouseholdStore } from "@presentation/stores/household";

export default function Actions() {
  const [leakEvents, setLeakEvents] = useState<Event[]>([]);
  const [unknownEvents, setUnknownEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const { selectedHouseholdId } = useHouseholdStore();

  const tActions = useTranslations("actions");
  const tCategories = useTranslations("common.categories");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("common.errors");
  const locale = useLocale();
  const dateFnsLocale = getDateFnsLocale(locale);

  const filteredCategories = categories.filter(
    (category) => category !== "rest" && category !== "unknown"
  );

  useEffect(() => {
    async function fetchEvents() {
      const resultLeak = await getLeakEvents(selectedHouseholdId);

      if (!resultLeak.success) {
        toast.error(tErrors(resultLeak.error));
        return;
      }

      setLeakEvents(resultLeak.data);

      const resultUnknown = await getUnknownEvents(selectedHouseholdId);

      if (!resultUnknown.success) {
        toast.error(tErrors(resultUnknown.error));
        return;
      }

      setUnknownEvents(resultUnknown.data);
    }

    fetchEvents();
  }, [selectedHouseholdId, tErrors]);

  function formatDate(date: Date) {
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
            {leakEvents.length > 0 ? (
              <Carousel className="ml-10 w-full max-w-3xs sm:max-w-xs md:max-w-sm lg:max-w-md">
                <CarouselPrevious className="h-full rounded-lg" />
                <CarouselContent>
                  {leakEvents.map((event, index) => (
                    <CarouselItem key={index}>
                      <Card>
                        <CardContent className="flex flex-col gap-2 p-6">
                          <Image
                            src={categoryMap[event.category].icon}
                            alt={event.category}
                            height={48}
                            width={48}
                          />
                          <span className="font-semibold">{tCategories(event.category)}</span>
                          <div className="flex flex-col">
                            <span>{formatDate(event.startDate)}</span>
                            <span>
                              {format(event.startDate, "HH:mm", { locale: dateFnsLocale })} -{" "}
                              {format(event.endDate, "HH:mm", { locale: dateFnsLocale })}
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
              <div>{tActions("no-leaks")}</div>
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
            {unknownEvents.length > 0 ? (
              <Carousel className="ml-10 w-full max-w-3xs sm:max-w-xs md:max-w-sm lg:max-w-md">
                <CarouselPrevious className="h-full rounded-lg" />
                <CarouselContent>
                  {unknownEvents.map((event, index) => (
                    <CarouselItem key={index}>
                      <Card>
                        <CardContent className="flex flex-col gap-2 p-6">
                          <Image
                            src={categoryMap[event.category].icon}
                            alt={event.category}
                            height={48}
                            width={48}
                          />
                          <span className="font-semibold">{tCategories(event.category)}</span>
                          <div className="flex flex-col">
                            <span>{formatDate(event.startDate)}</span>
                            <span>
                              {format(event.startDate, "HH:mm", { locale: dateFnsLocale })} -{" "}
                              {format(event.endDate, "HH:mm", { locale: dateFnsLocale })}
                            </span>
                          </div>
                          <span className="text-brand-secondary font-bold">
                            {event.consumptionInLiters} L
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
                                    src={categoryMap[category].icon}
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
              <div> {tActions("no-unknowns")}</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
