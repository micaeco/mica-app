import { useTranslations } from "next-intl";

import { Category, categoryMap } from "@domain/entities/category";
import { Event } from "@domain/entities/event";
import { ConsumptionBar } from "@presentation/components/consumption-bar";
import { EventBar } from "@presentation/components/event-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@presentation/components/ui/accordion";

type Props = {
  selectedCategories: Category[] | undefined;
  events: Event[];
};

export function ConsumptionPerEventChart({ selectedCategories, events }: Props) {
  const t = useTranslations("consumption-per-event-chart");
  const tCommon = useTranslations("common");

  const hasCategories = selectedCategories && selectedCategories.length > 0;
  const filteredEvents = hasCategories
    ? events.filter((event) => selectedCategories.some((category) => category === event.category))
    : events;

  if (filteredEvents.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-muted-foreground max-w-md text-center text-sm">{t("no-events-found")}</p>
      </div>
    );
  }

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => b.consumptionInLiters - a.consumptionInLiters
  );

  if (!selectedCategories || selectedCategories.length > 1) {
    return (
      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <EventBar
            key={event.id}
            event={event}
            totalConsumption={sortedEvents[0].consumptionInLiters}
          />
        ))}
      </div>
    );
  } else {
    const maxConsumption = sortedEvents[0]?.consumptionInLiters || 0;

    const eventsByTag = sortedEvents.reduce(
      (acc, event) => {
        const tagName = event.tag || tCommon("untagged");
        if (!acc[tagName]) acc[tagName] = { events: [], consumption: 0 };
        acc[tagName].events.push(event);
        acc[tagName].consumption += event.consumptionInLiters;
        return acc;
      },
      {} as Record<string, { events: Event[]; consumption: number }>
    );

    if (Object.keys(eventsByTag).length === 1) {
      return (
        <div className="space-y-4">
          {sortedEvents.map((event) => (
            <EventBar key={event.id} event={event} totalConsumption={maxConsumption} />
          ))}
        </div>
      );
    }

    const sortedTags = Object.entries(eventsByTag).sort(
      ([, a], [, b]) => b.consumption - a.consumption
    );

    const maxTagConsumption = sortedTags[0]?.[1].consumption || 0;

    return (
      <div className="space-y-6">
        <Accordion type="multiple" className="mb-6">
          {sortedTags.map(([tag, { events: tagEvents, consumption }]) => (
            <AccordionItem className="border-0" key={tag} value={tag}>
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex w-full flex-col items-center">
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{tag}</span>
                    <span>
                      {consumption.toFixed(1)} L / {tagEvents.length} {tCommon("uses")}
                    </span>
                  </div>
                  <ConsumptionBar
                    color={categoryMap[selectedCategories[0]].color}
                    consumptionPercentage={(consumption / maxTagConsumption) * 100}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-8">
                <div className="space-y-4 pt-2">
                  {tagEvents.map((event) => (
                    <EventBar
                      key={event.id}
                      event={event}
                      totalConsumption={tagEvents[0].consumptionInLiters}
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
