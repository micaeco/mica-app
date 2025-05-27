import { endOfDay, startOfDay } from "date-fns";

import { categories } from "@domain/entities/category";
import { Event } from "@domain/entities/event";
import { EventRepository } from "@domain/repositories/event";
import { MockTagRepository } from "@infrastructure/repositories/tag.mock";

export class MockEventRepository implements EventRepository {
  private eventsPerDay = 12;
  private averageEventDurationMs = 10 * 60 * 1000;

  private async generateEvents(
    householdId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Event[]> {
    const events: Event[] = [];
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysFraction = timeDiff / (1000 * 60 * 60 * 24); // This is now a fraction of a day

    // Calculate expected events proportional to time difference
    const expectedEvents = daysFraction * this.eventsPerDay;
    // Add variance (70% to 130% of expected)
    const numberOfEvents = Math.max(1, Math.round(expectedEvents * (0.7 + Math.random() * 0.6)));

    const tagRepo = new MockTagRepository();
    const tags = await tagRepo.getHouseholdTags("1");

    for (let i = 0; i < numberOfEvents; i++) {
      const eventStartTime = startDate.getTime() + Math.random() * timeDiff;
      const eventDuration = this.averageEventDurationMs * (0.5 + Math.random());
      const eventStartDate = new Date(eventStartTime);
      const eventEndDate = new Date(eventStartTime + eventDuration);

      // Make leak and unknown events rare
      let randomCategory;
      const rareProbability = 0.05; // 5% chance for rare events

      if (Math.random() < rareProbability) {
        // Generate a leak or unknown event
        const rareCategories = categories.filter(
          (category) => category === "leak" || category === "unknown"
        );
        randomCategory = rareCategories[Math.floor(Math.random() * rareCategories.length)];
      } else {
        // Generate a normal event (not leak or unknown)
        const normalCategories = categories.filter(
          (category) => category !== "leak" && category !== "unknown" && category !== "rest"
        );
        randomCategory = normalCategories[Math.floor(Math.random() * normalCategories.length)];
      }

      const possibleTags = tags.filter((tag) => tag.category === randomCategory);
      const randomTag = possibleTags
        ? Math.random() > 0.3 && possibleTags.length > 0
          ? possibleTags[Math.floor(Math.random() * possibleTags.length)]
          : undefined
        : undefined;
      const randomConsumption = Math.round(Math.random() * 100) / 10;

      events.push({
        id: i.toString(),
        category: randomCategory,
        householdId: "1",
        startDate: eventStartDate,
        endDate: eventEndDate,
        consumptionInLiters: randomConsumption,
        notes: [],
        tag: randomTag?.name,
      });
    }

    return events;
  }

  async getEvents(householdId: string, startDate: Date, endDate: Date): Promise<Event[]> {
    return this.generateEvents(householdId, startDate, endDate);
  }

  async getEventsForDay(householdId: string, date: Date): Promise<Event[]> {
    return this.generateEvents(householdId, startOfDay(date), endOfDay(date));
  }

  async getPaginatedEvents(
    householdId: string,
    offset: number,
    numberOfEvents: number
  ): Promise<Event[]> {
    const events = await this.generateEvents(
      householdId,
      new Date(new Date().setFullYear(2020)),
      new Date()
    );

    return events
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      .slice(offset, offset + numberOfEvents);
  }

  async getLeakEvents(householdId: string): Promise<Event[]> {
    const now = new Date();

    const events = await this.generateEvents(
      householdId,
      new Date(now.setDate(now.getDate() - 10)),
      new Date()
    );

    return events.filter((event) => event.category === "leak");
  }

  async getNumberOfLeakEvents(householdId: string): Promise<number> {
    const leakEvents = await this.getLeakEvents(householdId);
    return leakEvents.length;
  }

  async getUnknownEvents(householdId: string): Promise<Event[]> {
    const now = new Date();

    const events = await this.generateEvents(
      householdId,
      new Date(now.setDate(now.getDate() - 10)),
      new Date()
    );

    return events.filter((event) => event.category === "unknown");
  }

  async getNumberOfUnknownEvents(householdId: string): Promise<number> {
    const leakEvents = await this.getLeakEvents(householdId);
    return leakEvents.length;
  }
}
