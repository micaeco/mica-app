import { useTranslations } from "next-intl";

import { Category } from "@core/entities/category";
import { Event } from "@core/entities/event";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { EventBar } from "@/components/event";

type Props = {
  selectedCategories: Category[] | undefined;
  events: Event[];
};

export function ConsumptionPerEventChart({ selectedCategories, events }: Props) {
  const t = useTranslations("consumption-per-event-chart");

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

  const maxConsumption = sortedEvents[0]?.consumptionInLiters || 0;
  const isSingleCategory = selectedCategories?.length === 1;

  if (!isSingleCategory) {
    return (
      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <EventBar key={event.id} event={event} totalConsumption={maxConsumption} />
        ))}
      </div>
    );
  }

  const eventsByLabel = sortedEvents.reduce(
    (groups, event) => {
      const labelName = event.label?.name || "unlabeled";
      if (!groups[labelName]) {
        groups[labelName] = [];
      }
      groups[labelName].push(event);
      return groups;
    },
    {} as Record<string, Event[]>
  );

  const labelEntries = Object.entries(eventsByLabel);
  const hasLabels = labelEntries.some(([label]) => label !== "unlabeled");

  if (!hasLabels) {
    return (
      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <EventBar key={event.id} event={event} totalConsumption={maxConsumption} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Accordion type="multiple" className="mb-6">
        {labelEntries.map(([labelName, labelEvents]) => {
          const totalConsumption = labelEvents.reduce(
            (sum, event) => sum + event.consumptionInLiters,
            0
          );

          return (
            <AccordionItem key={labelName} value={labelName}>
              <AccordionTrigger className="py-3">
                <div className="flex items-center">
                  <span className="font-medium">{labelName}</span>
                  <span className="bg-brand-tertiary/80 text-foreground ml-3 rounded-full px-3 py-0.5 text-xs">
                    {labelEvents.length} events • {totalConsumption.toFixed(1)}L
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {labelEvents.map((event) => (
                    <EventBar key={event.id} event={event} totalConsumption={maxConsumption} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
