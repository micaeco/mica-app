import axios from "axios";
import { differenceInMilliseconds, endOfDay, startOfDay } from "date-fns";

import { Category } from "@domain/entities/category";
import { Consumption, Granularity } from "@domain/entities/consumption";
import { ConsumptionRepository } from "@domain/repositories/consumption";
import { HouseholdRepository } from "@domain/repositories/household";
import { env } from "@env";

interface ApiConsumptionDataPoint {
  timeBucket: string;
  consumptionInLiters: number;
  categoryBreakdown: Record<string, number>;
  consumptionInLitersBaseline: number;
  consumptionPercentDeviationFromBaseline: number;
}

interface ApiConsumptionResponse {
  householdId: string;
  granularity: Granularity;
  start: string;
  end: string;
  consumption: ApiConsumptionDataPoint[];
}

export class ApiConsumptionRepository implements ConsumptionRepository {
  private householdRepository: HouseholdRepository;

  constructor(householdRepository: HouseholdRepository) {
    this.householdRepository = householdRepository;
  }

  async getConsumption(householdId: string, startDate: Date, endDate: Date): Promise<Consumption> {
    return axios
      .get<ApiConsumptionResponse>(
        `${env.AWS_API_GATEWAY_URL}/households/${householdId}/consumption`,
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
        }
      )
      .then(async (response) => {
        const consumption = await this.mapApiConsumptionToEntity(response.data);
        return consumption[0];
      })
      .catch((error) => {
        throw new Error("Failed to fetch consumption data", { cause: error });
      });
  }

  async getConsumptionByGranularity(
    householdId: string,
    granularity: Granularity,
    startDate?: Date,
    endDate?: Date,
    order: "asc" | "desc" = "desc",
    cursor?: { timestamp: Date },
    limit?: number
  ): Promise<Consumption[]> {
    return axios
      .get<ApiConsumptionResponse>(
        `${env.AWS_API_GATEWAY_URL}/households/${householdId}/consumption`,
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            ...(startDate && { start: startDate?.toISOString() }),
            ...(endDate && { end: endDate?.toISOString() }),
            granularity,
            sort: "timestamp",
            order,
            ...(cursor && { cursor: JSON.stringify(cursor) }),
            ...(limit && { limit }),
          },
        }
      )
      .then(async (response) => {
        return this.mapApiConsumptionToEntity(response.data);
      })
      .catch((error) => {
        throw new Error("Failed to fetch consumption data by granularity", { cause: error });
      });
  }

  async getCurrentMonthConsumption(householdId: string): Promise<Consumption> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return axios
      .get<ApiConsumptionResponse>(
        `${env.AWS_API_GATEWAY_URL}/households/${householdId}/consumption`,
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            start: startOfMonth.toISOString(),
            end: endOfMonth.toISOString(),
            granularity: "month",
          },
        }
      )
      .then(async (response) => {
        const consumption = await this.mapApiConsumptionToEntity(response.data);
        return consumption[0];
      })
      .catch((error) => {
        throw new Error("Failed to fetch current month consumption", { cause: error });
      });
  }

  async getCurrentDayConsumption(householdId: string): Promise<Consumption> {
    const now = new Date();
    const startDate = startOfDay(now);
    const endDate = endOfDay(now);

    return axios
      .get<ApiConsumptionResponse>(
        `${env.AWS_API_GATEWAY_URL}/households/${householdId}/consumption`,
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            granularity: "day",
          },
        }
      )
      .then(async (response) => {
        const consumption = await this.mapApiConsumptionToEntity(response.data);
        return consumption[0];
      })
      .catch((error) => {
        throw new Error("Failed to fetch current day consumption", { cause: error });
      });
  }

  private async mapApiConsumptionToEntity(
    apiResponse: ApiConsumptionResponse
  ): Promise<Consumption[]> {
    try {
      if (apiResponse.consumption.length === 0) {
        return [];
      }

      const householdResidents = await this.householdRepository.findNumberOfResidents(
        apiResponse.householdId
      );

      return apiResponse.consumption.map((dataPoint) => {
        const startDate = new Date(dataPoint.timeBucket);
        const endDate = new Date(dataPoint.timeBucket);

        switch (apiResponse.granularity) {
          case "hour":
            endDate.setMinutes(59, 59, 999);
            break;
          case "day":
            endDate.setHours(23, 59, 59, 999);
            break;
          case "week":
            endDate.setDate(endDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            break;
          case "month":
            endDate.setMonth(endDate.getMonth() + 1, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        }

        if (new Date() < endDate) {
          endDate.setDate(new Date().getDate());
        }

        const categoryBreakdown = (() => {
          const sorted = Object.entries(dataPoint.categoryBreakdown)
            .map(([category, consumptionInLiters]) => ({
              category: category as Category,
              consumptionInLiters,
            }))
            .sort((a, b) => b.consumptionInLiters - a.consumptionInLiters);

          const topCategories = sorted.slice(0, 4);
          const rest = sorted.slice(4);
          const restTotal = rest.reduce((sum, item) => sum + item.consumptionInLiters, 0);

          if (restTotal > 0) {
            topCategories.push({
              category: "rest" as Category,
              consumptionInLiters: restTotal,
            });
          }

          return topCategories;
        })();

        const diffInMs = differenceInMilliseconds(endDate, startDate);
        const daysInPeriod = diffInMs > 0 ? diffInMs / (1000 * 60 * 60 * 24) : 1;
        const consumptionInLitersPerDayPerPerson =
          householdResidents > 0
            ? dataPoint.consumptionInLiters / householdResidents / daysInPeriod
            : 0;

        return {
          startDate,
          endDate,
          consumptionInLiters: dataPoint.consumptionInLiters,
          consumptionInLitersPerDayPerPerson,
          consumptionPercentDeviationFromBaseline:
            dataPoint.consumptionPercentDeviationFromBaseline * 100,
          categoryBreakdown,
        };
      });
    } catch (error) {
      throw new Error("Failed to process consumption data", { cause: error });
    }
  }
}
