import { categories, Category } from "@domain/entities/category";
import { Event } from "@domain/entities/event";
import { EventRepository } from "@domain/repositories/event";

export class MockEventRepository implements EventRepository {
  private eventsPerDay = 12;
  private averageEventDurationMs = 10 * 60 * 1000;
  private events: Event[] = [];

  constructor() {
    this.initializeEvents();
  }

  async create(
    userId: string,
    householdId: string,
    category: Category,
    startDate?: Date,
    endDate?: Date,
    tag?: string,
    notes?: string
  ): Promise<void> {
    const eventStartDate = startDate || new Date();
    const eventEndDate =
      endDate || new Date(eventStartDate.getTime() + this.averageEventDurationMs);

    const newEvent: Event = {
      id: (this.events.length + 1).toString(),
      category,
      startTimestamp: eventStartDate,
      endTimestamp: eventEndDate,
      durationInSeconds: Math.floor((eventEndDate.getTime() - eventStartDate.getTime()) / 1000),
      consumptionInLiters: Math.round(Math.random() * 100) / 10, // Random consumption for mock
      notes: notes || undefined,
      tag: tag || undefined,
    };

    this.events.push(newEvent);
  }

  async getEvents(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    categories?: Category[],
    sort: "timestamp" | "consumption" = "timestamp",
    order: "asc" | "desc" = "desc",
    cursor?: { timestamp: Date; id: string } | { consumption: number; id: string },
    limit?: number
  ): Promise<Event[]> {
    let filteredEvents = this.filterEventsByDateRange(
      startDate || new Date("2024-01-01"),
      endDate || new Date()
    ).filter((event) => {
      if (!categories || categories.length === 0) return true;
      return categories.includes(event.category);
    });

    if (cursor) {
      filteredEvents = filteredEvents.filter((event) => {
        if (sort === "consumption" && "consumption" in cursor) {
          return order === "asc"
            ? event.consumptionInLiters > cursor.consumption ||
                (event.consumptionInLiters === cursor.consumption && event.id > cursor.id)
            : event.consumptionInLiters < cursor.consumption ||
                (event.consumptionInLiters === cursor.consumption && event.id > cursor.id);
        } else if ("timestamp" in cursor) {
          return order === "asc"
            ? event.startTimestamp > cursor.timestamp ||
                (event.startTimestamp.getTime() === cursor.timestamp.getTime() &&
                  event.id > cursor.id)
            : event.startTimestamp < cursor.timestamp ||
                (event.startTimestamp.getTime() === cursor.timestamp.getTime() &&
                  event.id > cursor.id);
        }
        return true;
      });
    }

    return filteredEvents
      .sort((a, b) => {
        if (sort === "consumption") {
          const consumptionComparison = a.consumptionInLiters - b.consumptionInLiters;
          if (consumptionComparison === 0) {
            return a.id.localeCompare(b.id);
          }
          return order === "asc" ? consumptionComparison : -consumptionComparison;
        } else {
          const dateComparison = a.startTimestamp.getTime() - b.startTimestamp.getTime();
          if (dateComparison === 0) {
            return a.id.localeCompare(b.id);
          }
          return order === "asc" ? dateComparison : -dateComparison;
        }
      })
      .slice(0, limit);
  }

  async getNumberOfLeakEvents(householdId: string): Promise<number> {
    const leakEvents = await this.getEvents(householdId, undefined, undefined, ["leak"]);
    return leakEvents.length;
  }

  async getNumberOfUnknownEvents(householdId: string): Promise<number> {
    const unknownEvents = await this.getEvents(householdId, undefined, undefined, ["unknown"]);
    return unknownEvents.length;
  }

  private filterEventsByDateRange(startDate: Date, endDate: Date): Event[] {
    return this.events.filter(
      (event) => event.startTimestamp >= startDate && event.startTimestamp <= endDate
    );
  }

  private async initializeEvents(): Promise<void> {
    const startDate = new Date(new Date().setFullYear(2020));
    const endDate = new Date();
    const timeDifferenceMs = endDate.getTime() - startDate.getTime();
    const daysFraction = timeDifferenceMs / (1000 * 60 * 60 * 24);

    const expectedEvents = daysFraction * this.eventsPerDay;
    const numberOfEvents = Math.max(1, Math.round(expectedEvents * (0.7 + Math.random() * 0.6)));

    for (let i = 0; i < numberOfEvents; i++) {
      const eventStartTime = startDate.getTime() + Math.random() * timeDifferenceMs;
      const eventDuration = this.averageEventDurationMs * (0.5 + Math.random());
      const eventStartDate = new Date(eventStartTime);
      const eventEndDate = new Date(eventStartTime + eventDuration);

      const rareEventProbability = 0.05;
      let randomCategory;

      if (Math.random() < rareEventProbability) {
        const rareCategories = categories.filter(
          (category) => category === "leak" || category === "unknown"
        );
        randomCategory = rareCategories[Math.floor(Math.random() * rareCategories.length)];
      } else {
        const normalCategories = categories.filter(
          (category) => category !== "leak" && category !== "unknown" && category !== "rest"
        );
        randomCategory = normalCategories[Math.floor(Math.random() * normalCategories.length)];
      }

      const randomConsumption = Math.round(Math.random() * 100) / 10;

      this.events.push({
        id: i.toString(),
        category: randomCategory,
        startTimestamp: eventStartDate,
        endTimestamp: eventEndDate,
        durationInSeconds: Math.floor((eventEndDate.getTime() - eventStartDate.getTime()) / 1000),
        consumptionInLiters: randomConsumption,
        notes: "",
        tag: "",
      });
    }
  }

  async update(
    userId: string,
    sensorId: string,
    startDate: Date,
    endDate: Date,
    category?: Category,
    tag?: string,
    notes?: string
  ): Promise<void> {
    const eventIndex = this.events.findIndex((event) => event.id === sensorId);
    if (eventIndex === -1) {
      throw new Error(`Event with id ${sensorId} not found`);
    }

    const updatedEvent = { ...this.events[eventIndex] };
    if (category) {
      updatedEvent.category = category;
    }
    if (tag) {
      updatedEvent.tag = tag;
    }
    if (notes) {
      updatedEvent.notes = notes;
    }

    this.events[eventIndex] = updatedEvent;
  }

  async updateByTag(
    householdId: string,
    category: string,
    tag: string,
    newTag: string
  ): Promise<void> {
    this.events.forEach((event) => {
      if (event.category === category && event.tag === tag) {
        event.tag = newTag;
      }
    });
  }

  async deleteByTag(householdId: string, category: string, tag: string): Promise<void> {
    this.events = this.events.filter(
      (event) => !(event.category === category && event.tag === tag)
    );
  }
}
