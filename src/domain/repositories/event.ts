import { Event } from "@domain/entities/event";

export interface EventRepository {
  getEvents(householdId: string, startTimestamp: Date, endTimestamp: Date): Promise<Event[]>;

  getEventsSortedByTimestamp(
    householdId: string,
    startTimestamp?: Date,
    endTimestamp?: Date,
    order?: "asc" | "desc",
    cursor?: { timestamp: Date; id: string },
    limit?: number
  ): Promise<Event[]>;

  getEventsSortedByConsumption(
    householdId: string,
    startTimestamp?: Date,
    endTimestamp?: Date,
    categories?: string[],
    order?: "asc" | "desc",
    cursor?: { consumption: number; id: string },
    limit?: number
  ): Promise<Event[]>;

  getLeakEvents(householdId: string): Promise<Event[]>;

  getNumberOfLeakEvents(householdId: string): Promise<number>;

  getUnknownEvents(householdId: string): Promise<Event[]>;

  getNumberOfUnknownEvents(householdId: string): Promise<number>;
}
