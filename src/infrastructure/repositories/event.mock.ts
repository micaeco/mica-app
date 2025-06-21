import { categories, Category } from "@domain/entities/category";
import { Event } from "@domain/entities/event";
import { EventRepository } from "@domain/repositories/event";
import { MockTagRepository } from "@infrastructure/repositories/tag.mock";

export class MockEventRepository implements EventRepository {
  private eventsPerDay = 12;
  private averageEventDurationMs = 10 * 60 * 1000;
  private events: Event[] = [];

  constructor() {
    this.initializeEvents();
  }

  async getEvents(householdId: string, startDate: Date, endDate: Date): Promise<Event[]> {
    return this.filterEventsByDateRange(startDate, endDate);
  }

  async getEventsSortedByTimestamp(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    order: "asc" | "desc" = "desc",
    cursor?: { date: Date; id: string },
    limit: number = 50
  ): Promise<Event[]> {
    const effectiveStartDate = startDate || new Date(0);
    const effectiveEndDate = endDate || new Date();

    const filteredEvents = this.filterEventsByDateRange(effectiveStartDate, effectiveEndDate);

    const sortedEvents = [...filteredEvents].sort((a, b) => {
      const dateComparison = a.startTimestamp.getTime() - b.startTimestamp.getTime();
      if (dateComparison === 0) {
        return a.id.localeCompare(b.id);
      }
      return order === "asc" ? dateComparison : -dateComparison;
    });

    let startIndex = 0;

    if (cursor) {
      const cursorComparisonFunction = (event: Event) => {
        const dateDiff = event.startTimestamp.getTime() - cursor.date.getTime();

        if (dateDiff === 0) {
          return event.id.localeCompare(cursor.id);
        }

        return order === "asc" ? dateDiff : -dateDiff;
      };

      startIndex = sortedEvents.findIndex((event) => {
        const comparisonResult = cursorComparisonFunction(event);
        return comparisonResult > 0;
      });

      if (startIndex === -1) {
        return [];
      }
    }

    return sortedEvents.slice(startIndex, startIndex + limit);
  }

  async getEventsSortedByConsumption(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    categories?: Category[],
    order: "asc" | "desc" = "desc",
    cursor?: { consumption: number; id: string },
    limit: number = 50
  ): Promise<Event[]> {
    let filteredEvents = this.filterEventsByDateRange(
      startDate || new Date(0),
      endDate || new Date()
    );

    if (categories && categories.length > 0) {
      filteredEvents = filteredEvents.filter((event) => {
        return categories.includes(event.category);
      });
    }

    const sortedEvents = filteredEvents.sort((a, b) => {
      const consumptionComparison =
        order === "asc"
          ? a.consumptionInLiters - b.consumptionInLiters
          : b.consumptionInLiters - a.consumptionInLiters;

      if (consumptionComparison === 0) {
        return a.id < b.id ? -1 : 1;
      }

      return consumptionComparison;
    });

    let startIndex = 0;
    if (cursor) {
      const foundIndex = sortedEvents.findIndex((e) => {
        const consumptionDiff =
          order === "asc"
            ? e.consumptionInLiters - cursor.consumption
            : cursor.consumption - e.consumptionInLiters;

        if (consumptionDiff === 0) {
          return e.id > cursor.id;
        }

        return consumptionDiff > 0;
      });
      if (foundIndex !== -1) {
        startIndex = foundIndex;
      } else {
        return [];
      }
    }

    const result = sortedEvents.slice(startIndex, startIndex + limit);

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getLeakEvents(householdId: string): Promise<Event[]> {
    const now = new Date();
    const tenDaysAgo = new Date(now.setDate(now.getDate() - 10));

    const recentEvents = this.filterEventsByDateRange(tenDaysAgo, new Date());
    return recentEvents.filter((event) => event.category === "leak");
  }

  async getNumberOfLeakEvents(householdId: string): Promise<number> {
    const leakEvents = await this.getLeakEvents(householdId);
    return leakEvents.length;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUnknownEvents(householdId: string): Promise<Event[]> {
    const now = new Date();
    const tenDaysAgo = new Date(now.setDate(now.getDate() - 10));

    const recentEvents = this.filterEventsByDateRange(tenDaysAgo, new Date());
    return recentEvents.filter((event) => event.category === "unknown");
  }

  async getNumberOfUnknownEvents(householdId: string): Promise<number> {
    const unknownEvents = await this.getUnknownEvents(householdId);
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

    const tagRepository = new MockTagRepository();
    const householdTags = await tagRepository.getHouseholdTags("1");

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

      const possibleTags = householdTags.filter((tag) => tag.category === randomCategory);
      const randomTag =
        Math.random() > 0.3 && possibleTags.length > 0
          ? possibleTags[Math.floor(Math.random() * possibleTags.length)]
          : undefined;
      const randomConsumption = Math.round(Math.random() * 100) / 10;

      this.events.push({
        id: i.toString(),
        category: randomCategory,
        startTimestamp: eventStartDate,
        endTimestamp: eventEndDate,
        consumptionInLiters: randomConsumption,
        notes: [],
        tag: randomTag?.name,
      });
    }
  }
}
