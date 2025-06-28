import { Household } from "@domain/entities/household";

export interface HouseholdRepository {
  create(household: Omit<Household, "id">): Promise<Household>;

  exists(householdId: string): Promise<boolean>;

  findAll(): Promise<Household[]>;

  findById(householdId: string): Promise<Household | null>;

  findBySensorId(sensorId: string): Promise<Household | null>;

  findNumberOfResidents(householdId: string): Promise<number>;

  update(householdId: string, household: Partial<Household>): Promise<Household | null>;

  delete(householdId: string): Promise<Household | null>;
}
