import { Household } from "@domain/entities/household";
import { HouseholdRepository } from "@domain/repositories/household";

export const mockHouseholds: Household[] = [];

export class MockHouseholdRepository implements HouseholdRepository {
  private households: Household[];

  constructor() {
    this.households = [...mockHouseholds];
  }

  findAll(): Household[] {
    return [...this.households];
  }

  create(household: Omit<Household, "id">): Household {
    const newHousehold: Household = {
      ...household,
      id: String(
        this.households.length > 0 ? Math.max(...this.households.map((h) => parseInt(h.id))) + 1 : 1
      ),
    };
    this.households.push(newHousehold);
    return newHousehold;
  }

  findById(householdId: string): Household | null {
    return this.households.find((household) => household.id === householdId) || null;
  }

  update(id: string, household: Partial<Household>): Household | null {
    const index = this.households.findIndex((h) => h.id === id);
    if (index !== -1) {
      this.households[index] = { ...this.households[index], ...household };
      return this.households[index];
    }
    return null;
  }

  delete(householdId: string): Household | null {
    const index = this.households.findIndex((h) => h.id === householdId);
    if (index === -1) return null;

    const household = this.households[index];
    this.households.splice(index, 1);
    return household;
  }
}
