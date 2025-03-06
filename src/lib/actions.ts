"use server";

import { Household } from "@core/entities/household";
import { MockHouseholdRepository } from "@infrastructure/repositories/household.mock";

export async function findAllHouseholds(): Promise<Household[]> {
  const householdRepo = new MockHouseholdRepository();
  return householdRepo.findAll();
}

export async function updateHousehold(
  householdId: Household["id"],
  household: Partial<Omit<Household, "id">>
): Promise<void> {
  const householdRepo = new MockHouseholdRepository();
  householdRepo.update(householdId, household);
}
