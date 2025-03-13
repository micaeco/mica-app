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
  category: Category | undefined;
  events: Event[];
  totalConsumption: number;
};

export function ConsumptionPerEventChart({ category, events, totalConsumption }: Props) {
  const filteredEvents = category
    ? events.filter((event) => event.category.type === category.type)
    : events;

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
                    {events.map((event) => (
                      <EventBar key={event.id} event={event} totalConsumption={totalConsumption} />
                    ))}
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
                    {unlabeledEvents.map((event) => (
                      <EventBar key={event.id} event={event} totalConsumption={totalConsumption} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        ) : (
          <div className="space-y-4">
            {unlabeledEvents.map((event) => (
              <EventBar key={event.id} event={event} totalConsumption={totalConsumption} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => (
        <EventBar key={event.id} event={event} totalConsumption={totalConsumption} />
      ))}
    </div>
  );
}
