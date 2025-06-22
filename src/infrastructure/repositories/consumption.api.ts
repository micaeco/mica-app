import axios from "axios";
import { differenceInMilliseconds, endOfDay, startOfDay } from "date-fns";

import { Category } from "@domain/entities/category";
import { Consumption, Granularity } from "@domain/entities/consumption";
import { ConsumptionRepository } from "@domain/repositories/consumption";
import { HouseholdRepository } from "@domain/repositories/household";
import { env } from "env";

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
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/consumption",
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
      });
  }

  async getConsumptionByGranularity(
    householdId: string,
    startDate: Date,
    endDate: Date,
    granularity: Granularity
  ): Promise<Consumption[]> {
    return axios
      .get<ApiConsumptionResponse>(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/consumption",
        {
          headers: {
            Authorization: `Bearer ${env.AWS_API_GATEWAY_TOKEN}`,
          },
          params: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            granularity,
          },
        }
      )
      .then(async (response) => {
        return await this.mapApiConsumptionToEntity(response.data);
      });
  }

  async getCurrentMonthConsumption(householdId: string): Promise<Consumption> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return axios
      .get<ApiConsumptionResponse>(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/consumption",
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
      });
  }

  async getCurrentDayConsumption(householdId: string): Promise<Consumption> {
    const now = new Date();
    const startDate = startOfDay(now);
    const endDate = endOfDay(now);

    return axios
      .get<ApiConsumptionResponse>(
        env.AWS_API_GATEWAY_URL + "/households/" + householdId + "/consumption",
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
      });
  }

  private async mapApiConsumptionToEntity(
    apiResponse: ApiConsumptionResponse
  ): Promise<Consumption[]> {
    if (apiResponse.consumption.length > 0) {
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

        const aggregatedCategoryBreakdown: Record<string, number> = {};
        for (const category in dataPoint.categoryBreakdown) {
          if (Object.prototype.hasOwnProperty.call(dataPoint.categoryBreakdown, category)) {
            aggregatedCategoryBreakdown[category] =
              (aggregatedCategoryBreakdown[category] || 0) + dataPoint.categoryBreakdown[category];
          }
        }

        const categoryBreakdown = Object.entries(aggregatedCategoryBreakdown).map(
          ([category, consumptionInLiters]) => ({
            category: category as Category,
            consumptionInLiters: consumptionInLiters,
          })
        );

        const diffInMs = differenceInMilliseconds(endDate, startDate);
        const daysInPeriod = diffInMs / (1000 * 60 * 60 * 24);
        const consumptionInLitersPerDayPerPerson =
          householdResidents > 0
            ? dataPoint.consumptionInLiters / householdResidents / daysInPeriod
            : 0;

        const consumption: Consumption = {
          startDate,
          endDate,
          consumptionInLiters: dataPoint.consumptionInLiters,
          consumptionInLitersPerDayPerPerson: consumptionInLitersPerDayPerPerson,
          consumptionPercentDeviationFromBaseline:
            dataPoint.consumptionPercentDeviationFromBaseline * 100,
          categoryBreakdown,
        };

        return consumption;
      });
    } else {
      return [];
    }
  }
}
