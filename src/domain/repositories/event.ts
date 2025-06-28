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
  ): Promise<Event>;

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

  getNumberOfLeakEvents(householdId: string): Promise<number>;

  getNumberOfUnknownEvents(householdId: string): Promise<number>;

  updateEvent(
    userId: string,
    eventId: string,
    startDate: Date,
    endDate: Date,
    category?: Category,
    tag?: string
  ): Promise<void>;
}
