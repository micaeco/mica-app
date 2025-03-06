import { Household } from "@core/entities/household";
export interface HouseholdRepository {
  create(household: Omit<Household, "id">): Household;

  findById(householdId: string): Household | null;

  update(householdId: string, household: Partial<Household>): Household | null;

  delete(householdId: string): Household | null;
}
