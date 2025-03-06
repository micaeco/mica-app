import "server-only";

import { Household } from "@core/entities/household";
import { HouseholdRepository } from "@core/repositories/household";

const initialHouseholds: Household[] = [
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

    sensor: {
      id: "1",
      battery: 100,
      state: "active",
    },
  },
  {
    id: "2",
    name: "Household 2",

    surface: 150,
    residents: 3,
    street1: "456 Elm St",
    street2: "",
    city: "Shelbyville",
    zip: "54321",
    country: "USA",

    sensor: {
      id: "2",
      battery: 50,
      state: "active",
    },
  },
  {
    id: "3",
    name: "Household 3",

    surface: 200,
    residents: 4,
    street1: "789 Oak St",
    street2: "",
    city: "Capital City",
    zip: "67890",
    country: "USA",

    sensor: {
      id: "3",
      battery: 75,
      state: "active",
    },
  },
];

export class MockHouseholdRepository implements HouseholdRepository {
  private getHouseholds(): Household[] {
    return initialHouseholds;
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
