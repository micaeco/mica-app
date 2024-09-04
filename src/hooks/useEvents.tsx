// src/hooks/useEvents.ts

import { useState, useEffect, useCallback } from "react";
import { Event } from "@/types";
import { generateEvents } from "@/lib/mock";

const NUMBER_OF_EVENTS = 1000;

export function useEvents() {
  // In the future, when we pull the data from an API, we will need to fetch periodically

  const [events, setEvents] = useState<Event[]>(
    generateEvents(NUMBER_OF_EVENTS)
  );

  const refreshEvents = useCallback(() => {
    setEvents(generateEvents(NUMBER_OF_EVENTS));
  }, []);

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
