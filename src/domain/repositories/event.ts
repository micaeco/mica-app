import { Category } from "@domain/entities/category";
import { Event } from "@domain/entities/event";

export interface EventRepository {
  create(
    userId: string,
    householdId: string,
    category: Category,
    startDate?: Date,
    endDate?: Date,
    tag?: string,
    notes?: string
  ): Promise<void>;

  getEvents(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    categories?: Category[],
    sort?: "timestamp" | "consumption",
    order?: "asc" | "desc",
    cursor?: { timestamp: Date; id: string } | { consumption: number; id: string },
    limit?: number
  ): Promise<Event[]>;

  getNumberOfLeakEvents(householdId: string, startDate: Date, endDate: Date): Promise<number>;

  getNumberOfUnknownEvents(householdId: string, startDate: Date, endDate: Date): Promise<number>;

  updateEvent(
    userId: string,
    eventId: string,
    startDate: Date,
    endDate: Date,
    category?: Category,
    tag?: string
  ): Promise<void>;

  deleteByTag(householdId: string, category: string, tag: string): Promise<void>;
}
