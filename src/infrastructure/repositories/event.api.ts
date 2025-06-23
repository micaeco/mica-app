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
    categories?: Category[]
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
          },
        }
      );
      return mapApiResponseToEventsArray(response.data.events);
    } catch {
      throw new Error("Failed to fetch events");
    }
  }

  async getEventsSortedByTimestamp(
    householdId: string,
    startTimestamp?: Date,
    endTimestamp?: Date,
    order?: "asc" | "desc",
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
            ...(startTimestamp && { start: startTimestamp?.toISOString() }),
            ...(endTimestamp && { end: endTimestamp?.toISOString() }),
            sort: "timestamp",
            ...(order && { order }),
            ...(cursor && { cursor: JSON.stringify(cursor) }),
            ...(limit && { limit }),
          },
        }
      );
      return mapApiResponseToEventsArray(response.data.events);
    } catch {
      throw new Error("Failed to fetch sorted events");
    }
  }

  async getEventsSortedByConsumption(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    categories?: string[],
    order?: "asc" | "desc",
    cursor?: { consumption: number; id: string },
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
            ...(startDate && { start: startDate.toISOString() }),
            ...(endDate && { end: endDate.toISOString() }),
            ...(categories && categories.length > 0 && { categories: categories.join(",") }),
            sort: "consumption",
            ...(order && { order }),
            ...(cursor && { cursor: JSON.stringify(cursor) }),
            ...(limit && { limit }),
          },
        }
      );

      return mapApiResponseToEventsArray(response.data.events);
    } catch {
      throw new Error("Failed to fetch sorted events");
    }
  }

  async getLeakEvents(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    order: "asc" | "desc" = "desc",
    cursor?: { timestamp: Date; id: string },
    limit: number = 50
  ): Promise<Event[]> {
    try {
      const response = await axios.get<EventApiDataResponse>(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/events",
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            ...(startDate && { start: startDate.toISOString() }),
            ...(endDate && { end: endDate.toISOString() }),
            categories: "leak",
            sort: "timestamp",
            ...(order && { order }),
            ...(cursor && { cursor: JSON.stringify(cursor) }),
            ...(limit && { limit }),
          },
        }
      );
      return mapApiResponseToEventsArray(response.data.events);
    } catch {
      throw new Error("Failed to fetch leak events");
    }
  }

  async getUnknownEvents(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
    order: "asc" | "desc" = "desc",
    cursor?: { timestamp: Date; id: string },
    limit: number = 50
  ): Promise<Event[]> {
    try {
      const response = await axios.get<EventApiDataResponse>(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/events",
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            ...(startDate && { start: startDate.toISOString() }),
            ...(endDate && { end: endDate.toISOString() }),
            categories: "unknown",
            sort: "timestamp",
            ...(order && { order }),
            ...(cursor && { cursor: JSON.stringify(cursor) }),
            ...(limit && { limit }),
          },
        }
      );
      return mapApiResponseToEventsArray(response.data.events);
    } catch {
      throw new Error("Failed to fetch unknown events");
    }
  }

  async getNumberOfLeakEvents(householdId: string): Promise<number> {
    return this.getLeakEvents(householdId).then((events) => events.length);
  }

  async getNumberOfUnknownEvents(householdId: string): Promise<number> {
    return this.getUnknownEvents(householdId).then((events) => events.length);
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
