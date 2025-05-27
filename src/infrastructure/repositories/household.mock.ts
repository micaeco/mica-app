import { Household } from "@domain/entities/household";
import { HouseholdRepository } from "@domain/repositories/household";

export const mockHouseholds: Household[] = [
  {
    id: "1",
    name: "Household 1",

    surface: 100,
    residents: 2,
    street1: "123 Maple St",
    street2: "",
    city: "Springfield",
    zip: "12345",
    country: "USA",

    sensorId: "1",
  },
];

export class MockHouseholdRepository implements HouseholdRepository {
  private getHouseholds(): Household[] {
    return mockHouseholds;
  }

  findAll() {
    return this.getHouseholds();
  }

  create(household: Omit<Household, "id">): Household {
    const households = this.getHouseholds();
    const newHousehold: Household = {
      ...household,
      id: String(households.length + 1),
    };
    households.push(newHousehold);
    return newHousehold;
  }

  findById(householdId: string) {
    const households = this.getHouseholds();
    return households.find((household) => household.id === householdId) || null;
  }

  update(id: string, household: Partial<Household>) {
    const households = this.getHouseholds();
    const index = households.findIndex((household) => household.id === id);
    if (index !== -1) {
      households[index] = { ...households[index], ...household };
      return households[index];
    }
    return null;
  }

  delete(householdId: string) {
    const households = this.getHouseholds();
    const index = households.findIndex((household) => household.id === householdId);
    if (index === -1) return null;

    const household = households[index];
    households.splice(index, 1);
    return household;
  }
}
