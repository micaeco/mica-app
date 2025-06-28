import { Household } from "@domain/entities/household";
import { HouseholdRepository } from "@domain/repositories/household";

export const mockHouseholds: Household[] = [];

export class MockHouseholdRepository implements HouseholdRepository {
  private households: Household[];

  constructor() {
    this.households = [...mockHouseholds];
  }

  async create(household: Omit<Household, "id">): Promise<Household> {
    const newHousehold: Household = {
      ...household,
      id: String(
        this.households.length > 0 ? Math.max(...this.households.map((h) => parseInt(h.id))) + 1 : 1
      ),
    };
    this.households.push(newHousehold);
    return newHousehold;
  }

  async exists(householdId: string): Promise<boolean> {
    return this.households.some((household) => household.id === householdId);
  }

  async findAll(): Promise<Household[]> {
    return [...this.households];
  }

  async findById(householdId: string): Promise<Household | null> {
    return this.households.find((household) => household.id === householdId) || null;
  }

  async findBySensorId(sensorId: string): Promise<Household | null> {
    return this.households.find((household) => household.sensorId === sensorId) || null;
  }

  async findNumberOfResidents(householdId: string): Promise<number> {
    const household = this.households.find((h) => h.id === householdId);
    return household?.residents || 1;
  }

  async update(id: string, household: Partial<Household>): Promise<Household | null> {
    const index = this.households.findIndex((h) => h.id === id);
    if (index !== -1) {
      this.households[index] = { ...this.households[index], ...household };
      return this.households[index];
    }
    return null;
  }

  async delete(householdId: string): Promise<Household | null> {
    const index = this.households.findIndex((h) => h.id === householdId);
    if (index === -1) return null;

    const household = this.households[index];
    this.households.splice(index, 1);
    return household;
  }
}
