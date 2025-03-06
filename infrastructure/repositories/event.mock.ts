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
      leak: [],
      other: [],
      unknown: [],
    };

    for (let i = 0; i < numberOfEvents; i++) {
      const eventStartTime = startDate.getTime() + Math.random() * timeDiff;
      const eventDuration = this.averageEventDurationMs * (0.5 + Math.random());
      const eventStartDate = new Date(eventStartTime);
      const eventEndDate = new Date(eventStartTime + eventDuration);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomLabel =
        categoriesToLabel[randomCategory.type][
          Math.floor(Math.random() * categoriesToLabel[randomCategory.type].length)
        ];
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
}
