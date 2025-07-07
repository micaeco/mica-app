import axios from "axios";

import { Category } from "@domain/entities/category";
import { Event } from "@domain/entities/event";
import { EventRepository } from "@domain/repositories/event";
import { TagRepository } from "@domain/repositories/tag";
import { env } from "@env";

interface EventApiResponse {
  eventId: string;
  start: string;
  end: string;
  duration: number;
  consumptionInLiters: number;
  category: string | null;
  tagId: number | null;
  notes: string | null;
}

interface EventApiDataResponse {
  events: EventApiResponse[];
}

export class ApiEventRepository implements EventRepository {
  private tagRepo: TagRepository;

  constructor(tagRepo: TagRepository) {
    this.tagRepo = tagRepo;
  }

  async create(
    userId: string,
    householdId: string,
    category: Category,
    startDate?: Date,
    endDate?: Date,
    tagId?: number,
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
          ...(tagId && { tagId }),
          ...(notes && { notes }),
        },
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
        }
      );
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
      return this.mapApiResponseToEventsArray(response.data.events);
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
    tagId?: number,
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
          ...(tagId && { tagId: tagId }),
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

  async deleteByTag(tagId: number): Promise<void> {
    try {
      await axios.delete(env.AWS_API_GATEWAY_URL + "/tags/" + tagId, {
        headers: {
          Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
        },
      });
    } catch {
      throw new Error("Failed to delete events by tag");
    }
  }

  private async mapApiResponseToEventsArray(
    apiResponseArray: EventApiResponse[]
  ): Promise<Event[]> {
    return Promise.all(
      apiResponseArray.map((apiResponse) => this.mapApiResponseToEvent(apiResponse))
    );
  }

  private async mapApiResponseToEvent(apiResponse: EventApiResponse): Promise<Event> {
    let tag;
    if (apiResponse.tagId) tag = await this.tagRepo.getTagById(apiResponse.tagId);

    return {
      id: apiResponse.eventId,
      category: (apiResponse.category as Category) || "unknown",
      startTimestamp: new Date(apiResponse.start),
      endTimestamp: new Date(apiResponse.end),
      durationInSeconds: apiResponse.duration || 0,
      consumptionInLiters: apiResponse.consumptionInLiters,
      tag: tag || undefined,
      notes: apiResponse.notes || undefined,
    };
  }
}
