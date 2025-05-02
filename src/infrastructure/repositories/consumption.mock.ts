import { categories } from "@domain/entities/category";
import { CategoryBreakdown, Consumption } from "@domain/entities/consumption";
import { ConsumptionRepository } from "@domain/repositories/consumption";

export class MockConsumptionRepository implements ConsumptionRepository {
  private seedMap: Map<string, number> = new Map();
  private baseHourlyMin = 0;
  private baseHourlyMax = 10;
  private instanceSeed: number;
  private baselineConsumptionPerDay = 150;
  private averagePersonCount = 2.5;

  constructor() {
    this.instanceSeed = Math.random();
  }

  private getSeed(householdId: string, date: Date): number {
    const key = `${householdId}-${date.toISOString().split("T")[0]}`;

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
        category: "sink",
        consumptionInLiters: 0,
      },
      {
        category: "shower",
        consumptionInLiters: 0,
      },
      {
        category: "toilet",
        consumptionInLiters: 0,
      },
      {
        category: "washer",
        consumptionInLiters: 0,
      },
      {
        category: "dishwasher",
        consumptionInLiters: 0,
      },
      {
        category: "irrigation",
        consumptionInLiters: 0,
      },
      {
        category: "pool",
        consumptionInLiters: 0,
      },
      {
        category: "other",
        consumptionInLiters: 0,
      },
      {
        category: "leak",
        consumptionInLiters: 0,
      },
      {
        category: "unknown",
        consumptionInLiters: 0,
      },
    ];

    let remainingConsumption = totalConsumption;

    // Assign random weights to categories, leaving the last one to balance the total
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      if (i === categories.length - 1) {
        // Last category gets whatever is left to ensure they sum to total
        const index = breakdown.findIndex((item) => item.category === category);
        if (index !== -1) {
          breakdown[index].consumptionInLiters = Math.round(remainingConsumption * 10) / 10;
        }
      } else {
        // Assign a random portion of the remaining consumption
        const portion = Math.random() * 0.5 * remainingConsumption;
        const value = Math.round(portion * 10) / 10; // Round to 1 decimal place
        const index = breakdown.findIndex((item) => item.category === category);
        if (index !== -1) {
          breakdown[index].consumptionInLiters = value;
        }
        remainingConsumption -= value;
      }
    }

    // Limit to top 4 categories + rest
    const sortedBreakdown = [...breakdown].sort(
      (a, b) => b.consumptionInLiters - a.consumptionInLiters
    );

    const topCategories = sortedBreakdown.slice(0, 5);
    const restConsumption = sortedBreakdown
      .slice(4)
      .reduce((sum, item) => sum + item.consumptionInLiters, 0);

    const finalBreakdown: CategoryBreakdown[] = [
      ...topCategories,
      {
        category: "rest" as const,
        consumptionInLiters: Math.round(restConsumption * 10) / 10,
      },
    ];

    return finalBreakdown;
  }

  private getDaysBetween(startDate: Date, endDate: Date): number {
    const oneDayMs = 24 * 60 * 60 * 1000;
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.max(1, Math.ceil(diffMs / oneDayMs));
  }

  private calculateConsumptionMetrics(
    consumptionInLiters: number,
    startDate: Date,
    endDate: Date
  ): Pick<
    Consumption,
    "consumptionInLitersPerDayPerPerson" | "consumptionPercentDeviationFromBaseline"
  > {
    const days = this.getDaysBetween(startDate, endDate);
    const consumptionPerDay = consumptionInLiters / days;
    const consumptionInLitersPerDayPerPerson = consumptionPerDay / this.averagePersonCount;

    const expectedConsumption = this.baselineConsumptionPerDay * days;
    const consumptionPercentDeviationFromBaseline =
      ((consumptionInLiters - expectedConsumption) / expectedConsumption) * 100;

    return {
      consumptionInLitersPerDayPerPerson: Number(consumptionInLitersPerDayPerPerson.toFixed(2)),
      consumptionPercentDeviationFromBaseline: Number(
        consumptionPercentDeviationFromBaseline.toFixed(0)
      ),
    };
  }

  async getHourlyConsumption(
    householdId: string,
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

      const seed = this.getSeed(householdId, currentDate);
      const hourSeed = (seed * (currentDate.getHours() + 1)) / 23;
      const consumptionInLiters = this.getRandomValue(
        this.baseHourlyMin,
        this.baseHourlyMax,
        hourSeed
      );

      const categoryBreakdown = await this.generateCategoryBreakdown(consumptionInLiters);
      const metrics = this.calculateConsumptionMetrics(consumptionInLiters, hourStart, hourEnd);

      result.push({
        startDate: hourStart,
        endDate: hourEnd,
        consumptionInLiters,
        categoryBreakdown,
        ...metrics,
      });

      currentDate.setHours(currentDate.getHours() + 1);
    }

    return result;
  }

  async getDailyConsumption(
    householdId: string,
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

      const hourlyData = await this.getHourlyConsumption(householdId, dayStart, dayEnd);
      const dailyConsumption = Math.round(
        hourlyData.reduce((sum, item) => sum + item.consumptionInLiters, 0)
      );

      const categoryBreakdown = await this.generateCategoryBreakdown(dailyConsumption);
      const metrics = this.calculateConsumptionMetrics(dailyConsumption, dayStart, dayEnd);

      result.push({
        startDate: dayStart,
        endDate: dayEnd,
        consumptionInLiters: dailyConsumption,
        categoryBreakdown,
        ...metrics,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  async getWeeklyConsumption(
    householdId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Consumption[]> {
    const result: Consumption[] = [];

    // Adjust firstDate to Monday (first day of week)
    const firstDate = new Date(startDate);
    const dayOfWeek = firstDate.getDay();
    firstDate.setDate(firstDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    firstDate.setHours(0, 0, 0, 0);

    // Adjust lastDate to Sunday (last day of week)
    const lastDate = new Date(endDate);
    const daysToAdd = lastDate.getDay() === 0 ? 0 : 7 - lastDate.getDay();
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

      const dailyData = await this.getDailyConsumption(householdId, effectiveStart, effectiveEnd);
      const weeklyConsumption = Math.round(
        dailyData.reduce((sum, item) => sum + item.consumptionInLiters, 0)
      );

      const categoryBreakdown = await this.generateCategoryBreakdown(weeklyConsumption);
      const metrics = this.calculateConsumptionMetrics(weeklyConsumption, weekStart, weekEnd);

      result.push({
        startDate: weekStart,
        endDate: weekEnd,
        consumptionInLiters: weeklyConsumption,
        categoryBreakdown,
        ...metrics,
      });

      currentDate.setDate(currentDate.getDate() + 7);
    }

    return result;
  }

  async getMonthlyConsumption(
    householdId: string,
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

      const dailyData = await this.getDailyConsumption(householdId, effectiveStart, effectiveEnd);
      const monthlyConsumption = Math.round(
        dailyData.reduce((sum, item) => sum + item.consumptionInLiters, 0)
      );

      const categoryBreakdown = await this.generateCategoryBreakdown(monthlyConsumption);
      const metrics = this.calculateConsumptionMetrics(monthlyConsumption, monthStart, monthEnd);

      result.push({
        startDate: monthStart,
        endDate: monthEnd,
        consumptionInLiters: monthlyConsumption,
        categoryBreakdown,
        ...metrics,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return result;
  }

  async getConsumption(householdId: string, startDate: Date, endDate: Date): Promise<Consumption> {
    const dailyData = await this.getDailyConsumption(householdId, startDate, endDate);
    const consumptionInLiters = dailyData.reduce((sum, item) => sum + item.consumptionInLiters, 0);

    const categoryBreakdown = await this.generateCategoryBreakdown(consumptionInLiters);
    const metrics = this.calculateConsumptionMetrics(consumptionInLiters, startDate, endDate);

    return {
      startDate,
      endDate,
      consumptionInLiters,
      categoryBreakdown,
      ...metrics,
    };
  }

  getCurrentMonthConsumption(householdId: string): Promise<Consumption> {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    return this.getConsumption(householdId, startDate, endDate);
  }

  getCurrentDayConsumption(householdId: string): Promise<Consumption> {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    return this.getConsumption(householdId, startDate, endDate);
  }
}
