import "server-only";

import { Event } from "@core/entities/event";
import { Sensor } from "@core/entities/sensor";
import { categories, CategoryType } from "@core/entities/category";
import { Label } from "@core/entities/label";
import { EventRepository } from "@core/repositories/event";

export class MockEventRepository implements EventRepository {
  private eventsPerDay = 12;
  private averageEventDurationMs = 10 * 60 * 1000;

  private generateEvents(sensorId: Sensor["id"], startDate: Date, endDate: Date): Event[] {
    const events: Event[] = [];
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysFraction = timeDiff / (1000 * 60 * 60 * 24); // This is now a fraction of a day

    // Calculate expected events proportional to time difference
    const expectedEvents = daysFraction * this.eventsPerDay;
    // Add variance (70% to 130% of expected)
    const numberOfEvents = Math.max(1, Math.round(expectedEvents * (0.7 + Math.random() * 0.6)));

    const categoriesToLabel: Record<CategoryType, Label[]> = {
      shower: [
        {
          name: "nens",
          categoryType: "shower",
          householdId: "1",
        },
        {
          name: "pares",
          categoryType: "shower",
          householdId: "1",
        },
      ],
      washer: [
        {
          name: "eco",
          categoryType: "washer",
          householdId: "1",
        },
        {
          name: "normal",
          categoryType: "washer",
          householdId: "1",
        },
        {
          name: "sport",
          categoryType: "washer",
          householdId: "1",
        },
      ],
      dishwasher: [
        {
          name: "eco",
          categoryType: "dishwasher",
          householdId: "1",
        },
        {
          name: "normal",
          categoryType: "dishwasher",
          householdId: "1",
        },
      ],
      sink: [],
      toilet: [],
      irrigation: [],
      pool: [],
      leak: [],
      other: [],
      unknown: [],
    };

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
        const rareCategories = categories.filter((c) => c.type === "leak" || c.type === "unknown");
        randomCategory = rareCategories[Math.floor(Math.random() * rareCategories.length)];
      } else {
        // Generate a normal event (not leak or unknown)
        const normalCategories = categories.filter(
          (c) => c.type !== "leak" && c.type !== "unknown"
        );
        randomCategory = normalCategories[Math.floor(Math.random() * normalCategories.length)];
      }

      const possibleLabels = categoriesToLabel[randomCategory.type];
      const randomLabel =
        Math.random() > 0.3 && possibleLabels.length > 0
          ? possibleLabels[Math.floor(Math.random() * possibleLabels.length)]
          : undefined;
      const randomConsumption = Math.round(Math.random() * 100) / 10;

      events.push({
        id: i.toString(),
        startDate: eventStartDate,
        endDate: eventEndDate,
        category: randomCategory,
        consumptionInLiters: randomConsumption,
        notes: [],
        label: randomLabel,
      });
    }

    return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  getEvents(sensorId: Sensor["id"], startDate: Date, endDate: Date): Event[] {
    return this.generateEvents(sensorId, startDate, endDate);
  }

  getLeakEvents(sensorId: Sensor["id"]): Event[] {
    const now = new Date();

    return this.generateEvents(sensorId, new Date(now.setDate(now.getDate() + 3)), new Date())
      .filter((e) => e.category.type === "leak")
      .slice(0, 3);
  }

  getUnknownEvents(sensorId: Sensor["id"]): Event[] {
    const now = new Date();

    return this.generateEvents(sensorId, new Date(now.setDate(now.getDate() + 3)), new Date())
      .filter((e) => e.category.type === "unknown")
      .slice(0, 3);
  }
}
