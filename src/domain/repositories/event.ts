import { Category } from "@domain/entities/category";
import { Event } from "@domain/entities/event";

export interface EventRepository {
  getEvents(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    categories?: Category[]
  ): Promise<Event[]>;

  getEventsSortedByTimestamp(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    order?: "asc" | "desc",
    cursor?: { timestamp: Date; id: string },
    limit?: number
  ): Promise<Event[]>;

  getEventsSortedByConsumption(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    categories?: string[],
    order?: "asc" | "desc",
    cursor?: { consumption: number; id: string },
    limit?: number
  ): Promise<Event[]>;

  getLeakEvents(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    order?: "asc" | "desc",
    cursor?: { timestamp: Date; id: string },
    limit?: number
  ): Promise<Event[]>;

  getUnknownEvents(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    order?: "asc" | "desc",
    cursor?: { timestamp: Date; id: string },
    limit?: number
  ): Promise<Event[]>;

  getNumberOfLeakEvents(householdId: string): Promise<number>;

  getNumberOfUnknownEvents(householdId: string): Promise<number>;

  updateEvent(userId: string, eventId: string, category?: Category, tag?: string): Promise<void>;
}
