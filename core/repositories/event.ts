import { Event } from "@core/entities/event";

export interface EventRepository {
  getEvents(householdId: string, startDate: Date, endDate: Date): Promise<Event[]>;

  getPaginatedEvents(householdId: string, offset: number, numberOfEvents: number): Promise<Event[]>;

  getLeakEvents(householdId: string): Promise<Event[]>;

  getNumberOfLeakEvents(householdId: string): Promise<number>;

  getUnknownEvents(householdId: string): Promise<Event[]>;

  getNumberOfUnknownEvents(householdId: string): Promise<number>;
}
