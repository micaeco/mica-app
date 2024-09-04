"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useEvents } from "@/hooks/useEvents";
import { Event } from "@/types";

interface EventsContextType {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  modifyEvent: (id: string, event: Partial<Event>) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function useEventsContext() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEventsContext must be used within an EventsProvider");
  }
  return context;
}

interface Props {
  children: ReactNode;
}

export default function EventsProvider({ children }: Props) {
  const eventsData = useEvents();

  return (
    <EventsContext.Provider value={eventsData}>
      {children}
    </EventsContext.Provider>
  );
}
