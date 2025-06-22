import { HouseholdRepository } from "@domain/repositories/household";
import { HouseholdUserRepository } from "@domain/repositories/household-user";
import { TagRepository } from "@domain/repositories/tag";

export interface Repositories {
  householdUserRepo: HouseholdUserRepository;
  householdRepo: HouseholdRepository;
  tagRepo: TagRepository;
}

export interface UnitOfWork {
  execute<T>(callback: (repositories: Repositories) => Promise<T>): Promise<T>;
}
