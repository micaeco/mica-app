import "server-only";

import { CategoryBreakdown, Consumption } from "@core/entities/consumption";
import { Sensor } from "@core/entities/sensor";
import { categories } from "@core/entities/category";
import { ConsumptionRepository } from "@core/repositories/consumption";

export class MockConsumptionRepository implements ConsumptionRepository {
  private seedMap: Map<string, number> = new Map();
  private baseHourlyMin = 0;
  private baseHourlyMax = 10;
  private instanceSeed: number;

  constructor() {
    this.instanceSeed = Math.random();
  }

  private getSeed(sensorId: string, date: Date): number {
    const key = `${sensorId}-${date.toISOString().split("T")[0]}`;

    if (!this.seedMap.has(key)) {
      // Add more variability with date components
      const dateValue = date.getDate() + date.getMonth() * 31;
      this.seedMap.set(key, Math.random() * this.instanceSeed * dateValue);
    }

    return this.seedMap.get(key)!;
  }

  private getRandomValue(min: number, max: number, seed: number): number {
    const value = min + ((max - min) * ((seed * 9301 + 49297) % 233280)) / 233280;
    return Math.round(value);
  }

  private async generateCategoryBreakdown(totalConsumption: number): Promise<CategoryBreakdown[]> {
    const breakdown: CategoryBreakdown[] = [
      {
        type: "sink",
        consumptionInLiters: 0,
      },
      {
        type: "shower",
        consumptionInLiters: 0,
      },
      {
        type: "toilet",
        consumptionInLiters: 0,
      },
      {
        type: "washer",
        consumptionInLiters: 0,
      },
      {
        type: "dishwasher",
        consumptionInLiters: 0,
      },
      {
        type: "irrigation",
        consumptionInLiters: 0,
      },
      {
        type: "other",
        consumptionInLiters: 0,
      },
      {
        type: "leak",
        consumptionInLiters: 0,
      },
      {
        type: "unknown",
        consumptionInLiters: 0,
      },
    ];

    let remainingConsumption = totalConsumption;

    // Assign random weights to categories, leaving the last one to balance the total
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      if (i === categories.length - 1) {
        // Last category gets whatever is left to ensure they sum to total
        const index = breakdown.findIndex((item) => item.type === category.type);
        if (index !== -1) {
          breakdown[index].consumptionInLiters = Math.round(remainingConsumption * 10) / 10;
        }
      } else {
        // Assign a random portion of the remaining consumption
        const portion = Math.random() * 0.5 * remainingConsumption;
        const value = Math.round(portion * 10) / 10; // Round to 1 decimal place
        const index = breakdown.findIndex((item) => item.type === category.type);
        if (index !== -1) {
          breakdown[index].consumptionInLiters = value;
        }
        remainingConsumption -= value;
      }
    }

    return breakdown;
  }

  async getHourlyConsumption(
    sensorId: Sensor["id"],
    startDate: Date,
    endDate: Date
  ): Promise<Consumption[]> {
    const result: Consumption[] = [];
    const currentDate = new Date(startDate);
    currentDate.setMinutes(0, 0, 0);

    const lastDate = new Date(endDate);
    lastDate.setMinutes(59, 59, 999);

    while (currentDate <= lastDate) {
      const hourStart = new Date(currentDate);
      const hourEnd = new Date(currentDate);
      hourEnd.setMinutes(59, 59, 999);

      const seed = this.getSeed(sensorId, currentDate);
      const hourSeed = (seed * (currentDate.getHours() + 1)) / 23;
      const consumptionInLiters = this.getRandomValue(
        this.baseHourlyMin,
        this.baseHourlyMax,
        hourSeed
      );

      const categoryBreakdown = await this.generateCategoryBreakdown(consumptionInLiters);

      result.push({
        startDate: hourStart,
        endDate: hourEnd,
        consumptionInLiters,
        categoryBreakdown,
      });

      currentDate.setHours(currentDate.getHours() + 1);
    }

    return result;
  }

  async getDailyConsumption(
    sensorId: Sensor["id"],
    startDate: Date,
    endDate: Date
  ): Promise<Consumption[]> {
    const result: Consumption[] = [];

    const currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    const lastDate = new Date(endDate);
    lastDate.setHours(23, 59, 59, 999);

    while (currentDate <= lastDate) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hourlyData = await this.getHourlyConsumption(sensorId, dayStart, dayEnd);
      const dailyConsumption = Math.round(
        hourlyData.reduce((sum, item) => sum + item.consumptionInLiters, 0)
      );

      const categoryBreakdown = await this.generateCategoryBreakdown(dailyConsumption);

      result.push({
        startDate: dayStart,
        endDate: dayEnd,
        consumptionInLiters: dailyConsumption,
        categoryBreakdown,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  async getWeeklyConsumption(
    sensorId: Sensor["id"],
    startDate: Date,
    endDate: Date
  ): Promise<Consumption[]> {
    const result: Consumption[] = [];

    const firstDate = new Date(startDate);
    firstDate.setDate(firstDate.getDate() - firstDate.getDay());
    firstDate.setHours(0, 0, 0, 0);

    const lastDate = new Date(endDate);
    const daysToAdd = 6 - lastDate.getDay();
    if (daysToAdd > 0) {
      lastDate.setDate(lastDate.getDate() + daysToAdd);
    }
    lastDate.setHours(23, 59, 59, 999);

    const currentDate = new Date(firstDate);

    while (currentDate <= lastDate) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const effectiveStart = weekStart < startDate ? startDate : weekStart;
      const effectiveEnd = weekEnd > endDate ? endDate : weekEnd;

      const dailyData = await this.getDailyConsumption(sensorId, effectiveStart, effectiveEnd);
      const weeklyConsumption = Math.round(
        dailyData.reduce((sum, item) => sum + item.consumptionInLiters, 0)
      );

      const categoryBreakdown = await this.generateCategoryBreakdown(weeklyConsumption);

      result.push({
        startDate: weekStart,
        endDate: weekEnd,
        consumptionInLiters: weeklyConsumption,
        categoryBreakdown,
      });

      currentDate.setDate(currentDate.getDate() + 7);
    }

    return result;
  }

  async getMonthlyConsumption(
    sensorId: Sensor["id"],
    startDate: Date,
    endDate: Date
  ): Promise<Consumption[]> {
    const result: Consumption[] = [];

    const firstMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    const currentDate = new Date(firstMonth);

    while (currentDate <= lastMonth) {
      const monthStart = new Date(currentDate);
      const monthEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      const effectiveStart = monthStart < startDate ? startDate : monthStart;
      const effectiveEnd = monthEnd > endDate ? endDate : monthEnd;

      const dailyData = await this.getDailyConsumption(sensorId, effectiveStart, effectiveEnd);
      const monthlyConsumption = Math.round(
        dailyData.reduce((sum, item) => sum + item.consumptionInLiters, 0)
      );

      const categoryBreakdown = await this.generateCategoryBreakdown(monthlyConsumption);

      result.push({
        startDate: monthStart,
        endDate: monthEnd,
        consumptionInLiters: monthlyConsumption,
        categoryBreakdown,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return result;
  }

  async getConsumption(
    sensorId: Sensor["id"],
    startDate: Date,
    endDate: Date
  ): Promise<Consumption> {
    const dailyData = await this.getDailyConsumption(sensorId, startDate, endDate);
    const consumptionInLiters = dailyData.reduce((sum, item) => sum + item.consumptionInLiters, 0);

    const categoryBreakdown = await this.generateCategoryBreakdown(consumptionInLiters);

    return {
      startDate,
      endDate,
      consumptionInLiters,
      categoryBreakdown,
    };
  }
}
