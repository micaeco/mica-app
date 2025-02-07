import { useState, useCallback } from "react";
import { useMessages } from "next-intl";

import { Event } from "@/lib/types";
import { generateEvents } from "@/lib/mock";
import { getDevices, getCategories } from "@/lib/constants";

const NUMBER_OF_EVENTS = 1000;

export function useEvents() {
  const messages = useMessages();
  const categories = getCategories(
    (messages.common as { categories: Record<string, string> }).categories
  );
  const devices = getDevices(
    (messages.common as { devices: Record<string, string> }).devices,
    categories
  );

  const [events, setEvents] = useState<Event[]>(generateEvents(NUMBER_OF_EVENTS, devices));

  const modifyEvent = useCallback((id: string, event: Partial<Event>) => {
    setEvents((events) => {
      const index = events.findIndex((e) => e.id === id);
      if (index === -1) {
        return events;
      }

      const newEvents = [...events];
      newEvents[index] = {
        ...newEvents[index],
        ...event,
      };

      return newEvents;
    });
  }, []);

  return {
    events,
    setEvents,
    modifyEvent,
  };
}
