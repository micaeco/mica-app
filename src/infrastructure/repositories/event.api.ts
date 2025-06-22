import axios from "axios";

import { Category } from "@domain/entities/category";
import { Event } from "@domain/entities/event";
import { EventRepository } from "@domain/repositories/event";
import { env } from "env";

export class ApiEventRepository implements EventRepository {
  async getEvents(householdId: string, startDate: Date, endDate: Date): Promise<Event[]> {
    try {
      const response = await axios.get<EventApiDataResponse>(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/events",
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }
      );
      return mapApiResponseToEventsArray(response.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
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
    } catch (error) {
      console.error("Error fetching sorted events:", error);
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
            ...(categories && { categories: categories.join(",") }),
            sort: "consumption",
            ...(order && { order }),
            ...(cursor && { cursor: JSON.stringify(cursor) }),
            ...(limit && { limit }),
          },
        }
      );
      return mapApiResponseToEventsArray(response.data.events);
    } catch (error) {
      console.error("Error fetching sorted events:", error);
      throw new Error("Failed to fetch sorted events");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getLeakEvents(householdId: string): Promise<Event[]> {
    try {
      const response = await axios.get<EventApiDataResponse>(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/events",
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            categories: "leak",
          },
        }
      );
      return mapApiResponseToEventsArray(response.data.events);
    } catch (error) {
      console.error("Error fetching leak events:", error);
      throw new Error("Failed to fetch leak events");
    }
  }

  async getNumberOfLeakEvents(householdId: string): Promise<number> {
    return this.getLeakEvents(householdId).then((events) => events.length);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUnknownEvents(householdId: string): Promise<Event[]> {
    try {
      const response = await axios.get<EventApiDataResponse>(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/events",
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            categories: "unknown",
          },
        }
      );
      return mapApiResponseToEventsArray(response.data.events);
    } catch (error) {
      console.error("Error fetching unknown events:", error);
      throw new Error("Failed to fetch unknown events");
    }
  }

  async getNumberOfUnknownEvents(householdId: string): Promise<number> {
    return this.getUnknownEvents(householdId).then((events) => events.length);
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
    durationInMs: apiResponse.duration,
    consumptionInLiters: apiResponse.consumptionInLiters,
    tag: apiResponse.tag || undefined,
    notes: apiResponse.notes || [],
  };
}

function mapApiResponseToEventsArray(apiResponseArray: EventApiResponse[]): Event[] {
  return apiResponseArray.map(mapApiResponseToEvent);
}
