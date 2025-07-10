"use client";

import { useState } from "react";

import { Bell, ChevronDown, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { LeakEventsCarousel } from "@app/[locale]/(protected)/actions/_components/leak-events-carousel";
import { UnknownEventsCarousel } from "@app/[locale]/(protected)/actions/_components/unknown-events-carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@app/_components/ui/accordion";

export default function Actions() {
  const tCommon = useTranslations("common");
  const [hasLeakEvents, setHasLeakEvents] = useState(true);
  const [hasUnknownEvents, setHasUnknownEvents] = useState(true);

  const handleLeakEventsDataStatus = (hasData: boolean) => {
    setHasLeakEvents(hasData);
  };

  const handleUnknownEventsDataStatus = (hasData: boolean) => {
    setHasUnknownEvents(hasData);
  };

  return (
    <div className="p-4">
      {hasLeakEvents || hasUnknownEvents ? (
        <Accordion type="multiple" defaultValue={["leakEvents", "unknownEvents"]}>
          {hasLeakEvents && (
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
                <LeakEventsCarousel onDataStatusChange={handleLeakEventsDataStatus} />
              </AccordionContent>
            </AccordionItem>
          )}

          {hasUnknownEvents && (
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
                <UnknownEventsCarousel onDataStatusChange={handleUnknownEventsDataStatus} />
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      ) : (
        <p>{tCommon("no-actions")}</p>
      )}
    </div>
  );
}
