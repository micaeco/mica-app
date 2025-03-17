import { useTranslations } from "next-intl";

import { Category } from "@core/entities/category";
import { Event } from "@core/entities/event";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { EventBar } from "@components/event";
import { ConsumptionBar } from "@/components/consumption-bar";

type Props = {
  selectedCategories: Category[] | undefined;
  events: Event[];
};

export function ConsumptionPerEventChart({ selectedCategories, events }: Props) {
  const t = useTranslations("consumption-per-event-chart");
  const tCommon = useTranslations("common");

  const hasCategories = selectedCategories && selectedCategories.length > 0;
  const filteredEvents = hasCategories
    ? events.filter((event) =>
        selectedCategories.some((category) => category.type === event.category.type)
      )
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

    const eventsByLabel = sortedEvents.reduce(
      (acc, event) => {
        const labelName = event.label?.name || "unlabeled";
        if (!acc[labelName]) acc[labelName] = { events: [], consumption: 0 };
        acc[labelName].events.push(event);
        acc[labelName].consumption += event.consumptionInLiters;
        return acc;
      },
      {} as Record<string, { events: Event[]; consumption: number }>
    );

    if (Object.keys(eventsByLabel).length === 1 && eventsByLabel["unlabeled"]) {
      return (
        <div className="space-y-4">
          {sortedEvents.map((event) => (
            <EventBar key={event.id} event={event} totalConsumption={maxConsumption} />
          ))}
        </div>
      );
    }

    const sortedLabels = Object.entries(eventsByLabel).sort(
      ([, a], [, b]) => b.consumption - a.consumption
    );

    const maxLabelConsumption = sortedLabels[0]?.[1].consumption || 0;

    return (
      <div className="space-y-6">
        <Accordion type="multiple" className="mb-6">
          {sortedLabels.map(([labelName, { events: labelEvents, consumption }]) => (
            <AccordionItem className="border-0" key={labelName} value={labelName}>
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex w-full flex-col items-center">
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{labelName}</span>
                    <span>
                      {consumption.toFixed(1)} L / {labelEvents.length} {tCommon("uses")}
                    </span>
                  </div>
                  <ConsumptionBar
                    color={selectedCategories[0].color}
                    consumptionPercentage={(consumption / maxLabelConsumption) * 100}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-8">
                <div className="space-y-4 pt-2">
                  {labelEvents.map((event) => (
                    <EventBar
                      key={event.id}
                      event={event}
                      totalConsumption={labelEvents[0].consumptionInLiters}
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
