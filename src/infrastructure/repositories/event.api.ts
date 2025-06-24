import axios from "axios";

import { Category } from "@domain/entities/category";
import { Event } from "@domain/entities/event";
import { EventRepository } from "@domain/repositories/event";
import { env } from "env";

export class ApiEventRepository implements EventRepository {
  async getEvents(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    categories?: Category[],
    sort: "timestamp" | "consumption" = "timestamp",
    order: "asc" | "desc" = "desc",
    cursor?: { timestamp: Date; id: string },
    limit?: number
  ): Promise<Event[]> {
    try {
      const response = await axios.get<EventApiDataResponse>(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/events",
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            ...(startDate && { startDate: startDate.toISOString() }),
            ...(endDate && { endDate: endDate.toISOString() }),
            ...(categories && categories.length > 0 && { categories: categories.join(",") }),
            ...(sort && { sort }),
            ...(order && { order }),
            ...(cursor && { cursor: JSON.stringify(cursor) }),
            ...(limit && { limit }),
          },
        }
      );
      return mapApiResponseToEventsArray(response.data.events);
    } catch {
      throw new Error("Failed to fetch events");
    }
  }

  async getNumberOfLeakEvents(householdId: string): Promise<number> {
    return this.getEvents(householdId, undefined, undefined, ["leak"]).then(
      (events) => events.length
    );
  }

  async getNumberOfUnknownEvents(householdId: string): Promise<number> {
    return this.getEvents(householdId, undefined, undefined, ["unknown"]).then(
      (events) => events.length
    );
  }

  async updateEvent(
    userId: string,
    eventId: string,
    startDate: Date,
    endDate: Date,
    category?: Category,
    tag?: string,
    notes?: string
  ): Promise<void> {
    try {
      await axios.post<EventApiResponse>(
        env.AWS_API_GATEWAY_URL + "/events/" + eventId + "/labels",
        {
          userId,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          ...(category && { category: category }),
          ...(tag && { tag: tag }),
          ...(notes && { notes: notes }),
        },
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
        }
      );
    } catch {
      throw new Error("Failed to update event");
    }
  }
}

interface EventApiResponse {
  eventId: string;
  start: string;
  end: string;
  duration: number;
  consumptionInLiters: number;
  category: string | null;
  tag: string | null;
  notes: string[] | null;
}

interface EventApiDataResponse {
  events: EventApiResponse[];
}

function mapApiResponseToEvent(apiResponse: EventApiResponse): Event {
  return {
    id: apiResponse.eventId,
    category: (apiResponse.category as Category) || "unknown",
    startTimestamp: new Date(apiResponse.start),
    endTimestamp: new Date(apiResponse.end),
    durationInSeconds: apiResponse.duration || 0,
    consumptionInLiters: apiResponse.consumptionInLiters,
    tag: apiResponse.tag || undefined,
    notes: apiResponse.notes || [],
  };
}

function mapApiResponseToEventsArray(apiResponseArray: EventApiResponse[]): Event[] {
  return apiResponseArray.map(mapApiResponseToEvent);
}
