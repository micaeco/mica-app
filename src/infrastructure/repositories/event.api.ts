import axios from "axios";

import { Category } from "@domain/entities/category";
import { Event } from "@domain/entities/event";
import { EventRepository } from "@domain/repositories/event";
import { env } from "env";

export class ApiEventRepository implements EventRepository {
  async create(
    userId: string,
    householdId: string,
    category: Category,
    startDate?: Date,
    endDate?: Date,
    tag?: string,
    notes?: string
  ): Promise<void> {
    try {
      await axios.post(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/events",
        {
          userId,
          category,
          ...(startDate && { start: startDate?.toISOString() }),
          ...(endDate && { end: endDate?.toISOString() }),
          ...(tag && { tag }),
          ...(notes && { notes }),
        },
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
        }
      );
      return;
    } catch {
      throw new Error("Failed to create event");
    }
  }

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
            ...(startDate && { start: startDate.toISOString() }),
            ...(endDate && { end: endDate.toISOString() }),
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

  async getNumberOfLeakEvents(
    householdId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    try {
      const response = await axios.get<{ leak: number } | null>(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/events/count",
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            categories: "leak",
            ...(startDate && { start: startDate.toISOString() }),
            ...(endDate && { end: endDate.toISOString() }),
          },
        }
      );
      return response.data?.leak || 0;
    } catch {
      throw new Error("Failed to fetch number of leak events");
    }
  }

  async getNumberOfUnknownEvents(
    householdId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    try {
      const response = await axios.get<{ unknown: number } | null>(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/events/count",
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            categories: "unknown",
            ...(startDate && { start: startDate.toISOString() }),
            ...(endDate && { end: endDate.toISOString() }),
          },
        }
      );
      return response.data?.unknown || 0;
    } catch {
      throw new Error("Failed to fetch number of unknown events");
    }
  }

  async update(
    userId: string,
    eventId: string,
    startDate: Date,
    endDate: Date,
    category?: Category,
    tag?: string,
    notes?: string
  ): Promise<void> {
    try {
      await axios.post(
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

  async updateByTag(
    householdId: string,
    category: string,
    tag: string,
    newTag: string
  ): Promise<void> {
    try {
      console.log("Updating events by tag:", {
        householdId,
        category,
        tag,
        newTag,
      });
      const response = await axios.patch(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/events/tags",
        {
          tag,
          category,
          newTag,
        },
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
        }
      );
      console.log("Response from updateByTag:", response.data);
    } catch {
      throw new Error("Failed to update events by tag");
    }
  }

  async deleteByTag(householdId: string, category: string, tag: string): Promise<void> {
    try {
      const response = await axios.delete(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/events/tags",
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            tag,
            category,
          },
        }
      );
      console.log("Response from deleteByTag:", response.data);
    } catch {
      throw new Error("Failed to delete events by tag");
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
  notes: string | null;
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
    notes: apiResponse.notes || undefined,
  };
}

function mapApiResponseToEventsArray(apiResponseArray: EventApiResponse[]): Event[] {
  return apiResponseArray.map(mapApiResponseToEvent);
}
