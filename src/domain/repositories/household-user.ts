import { HouseholdUser } from "@domain/entities/household-user";

export interface HouseholdUserRepository {
  create(householdUser: HouseholdUser): Promise<HouseholdUser>;

  findAll(): Promise<HouseholdUser[]>;

  findById(householdId: string, userId: string): Promise<HouseholdUser | null>;

  findByHouseholdId(householdId: string): Promise<HouseholdUser[]>;

  findByUserId(userId: string): Promise<HouseholdUser[]>;

  findUsersByHouseholdId(householdId: string): Promise<string[]>;

  findHouseholdsByUserId(userId: string): Promise<string[]>;

  updateRole(
    householdId: string,
    userId: string,
    householdUser: HouseholdUser["role"]
  ): Promise<HouseholdUser | null>;

  delete(householdId: string, userId: string): Promise<boolean>;
}
