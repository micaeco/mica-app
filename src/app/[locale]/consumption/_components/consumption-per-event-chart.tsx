import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Category } from "@core/entities/category";
import { Event } from "@core/entities/event";
import { TimeWindow } from "@lib/types";
import { getConsumption, getEvents } from "@app/[locale]/consumption/actions";
import { useHouseholdStore } from "@stores/household";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { LoaderCircle } from "lucide-react";

type Props = {
  timeWindow: TimeWindow;
  category: Category | undefined;
};

export function ConsumptionPerLabelChart({ timeWindow, category }: Props) {
  const tCategories = useTranslations("common.categories");
  const { selectedHouseholdSensorId } = useHouseholdStore();
  const [maxConsumption, setMaxConsumption] = useState<number>(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [consumptionResult, eventsResult] = await Promise.all([
        getConsumption(selectedHouseholdSensorId, timeWindow.startDate, timeWindow.endDate),
        getEvents(selectedHouseholdSensorId, timeWindow.startDate, timeWindow.endDate),
      ]);

      if (consumptionResult.success) {
        setMaxConsumption(consumptionResult.data.consumptionInLiters);
      }

      if (eventsResult.success) {
        setEvents(eventsResult.data);
      }

      setIsLoading(false);
    }

    fetchData();
    console.log("Fetched data in ConsumptionPerLabelChart");
  }, [selectedHouseholdSensorId, timeWindow]);

  const filteredEvents = category
    ? events.filter((event) => event.category.type === category.type)
    : events;

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center">
          <LoaderCircle size={64} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return <div className="text-muted-foreground py-8 text-center">No events found</div>;
  }

  if (category) {
    const labeledEvents = new Map<string, Event[]>();
    const unlabeledEvents: Event[] = [];

    filteredEvents.forEach((event) => {
      if (event.label) {
        const labelName = event.label.name;
        if (!labeledEvents.has(labelName)) {
          labeledEvents.set(labelName, []);
        }
        labeledEvents.get(labelName)!.push(event);
      } else {
        unlabeledEvents.push(event);
      }
    });

    const hasLabeledEvents = labeledEvents.size > 0;

    return (
      <div className="space-y-6">
        {hasLabeledEvents ? (
          <Accordion type="multiple" className="mb-6">
            {Array.from(labeledEvents).map(([labelName, events]) => (
              <AccordionItem key={labelName} value={labelName}>
                <AccordionTrigger className="py-3">
                  <div className="flex items-center">
                    <span className="font-medium">{labelName}</span>
                    <span className="bg-brand-tertiary/80 text-foreground ml-3 rounded-full px-3 py-0.5 text-xs">
                      {events.length} events •{" "}
                      {events.reduce((sum, event) => sum + event.consumptionInLiters, 0).toFixed(1)}
                      L
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {events.map((event) => renderEventItem(event, maxConsumption, tCategories))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
            {unlabeledEvents.length > 0 && (
              <AccordionItem key="unlabeled" value="unlabeled">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center">
                    <span className="font-medium">unlabeled</span>
                    <span className="bg-brand-tertiary/80 text-foreground ml-3 rounded-full px-3 py-0.5 text-xs">
                      {unlabeledEvents.length} events •{" "}
                      {unlabeledEvents
                        .reduce((sum, event) => sum + event.consumptionInLiters, 0)
                        .toFixed(1)}
                      L
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {unlabeledEvents.map((event) =>
                      renderEventItem(event, maxConsumption, tCategories)
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        ) : (
          <div className="space-y-4">
            {unlabeledEvents.map((event) => renderEventItem(event, maxConsumption, tCategories))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => renderEventItem(event, maxConsumption, tCategories))}
    </div>
  );
}

function renderEventItem(event: Event, maxConsumption: number, tCategories: any) {
  return (
    <div key={event.id}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src={event.category.icon} alt={event.category.type} width={32} height={32} />
          <span className="font-medium">{tCategories(event.category.type)}</span>
          {event.label && (
            <span className="bg-brand-tertiary/60 rounded-full px-3 py-0.5 text-xs">
              {event.label.name}
            </span>
          )}
        </div>
        <span className="text-lg font-bold">{event.consumptionInLiters.toFixed(1)}L</span>
      </div>

      <ProgressBar
        consumption={event.consumptionInLiters}
        limit={maxConsumption}
        color={event.category.color}
      />

      <div className="text-muted-foreground mt-2 text-sm">
        {new Date(event.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        {" - "}
        {event.endDate
          ? new Date(event.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "now"}
        <span className="ml-2 text-xs">
          ({getDuration(event.startDate, event.endDate || new Date())})
        </span>
      </div>
    </div>
  );
}

function getDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) {
    return "less than a minute";
  } else if (diffMins === 1) {
    return "1 min";
  } else if (diffMins < 60) {
    return `${diffMins} mins`;
  } else {
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return hours === 1
      ? `1 hr ${mins > 0 ? `${mins} min` : ""}`
      : `${hours} hrs ${mins > 0 ? `${mins} min` : ""}`;
  }
}

const ProgressBar = ({
  consumption,
  limit,
  color,
}: {
  consumption: number;
  limit: number;
  color: string;
}) => {
  const percentage = Math.min(100, (consumption / limit) * 100);
  return (
    <div className="bg-muted relative h-3 w-full rounded-full">
      <div
        className="absolute h-full rounded-full transition-all duration-300"
        style={{
          width: `${Math.max(percentage, 3)}%`,
          backgroundColor: `hsl(var(--${color}))`,
        }}
      />
    </div>
  );
};
