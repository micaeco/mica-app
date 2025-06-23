"use client";

import { Bell, ChevronDown, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { LeakEventsCarousel } from "@app/[locale]/actions/_components/leak-events-carousel";
import { UnknownEventsCarousel } from "@app/[locale]/actions/_components/unknown-events-carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@app/_components/ui/accordion";

export default function Actions() {
  const tCommon = useTranslations("common");

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
            <LeakEventsCarousel />
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
            <UnknownEventsCarousel />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
