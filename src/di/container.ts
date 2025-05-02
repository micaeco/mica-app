import { EventRepository } from "@domain/repositories/event";
import { HouseholdRepository } from "@domain/repositories/household";
import { MockEventRepository } from "@infrastructure/repositories/event.mock";
import { MockHouseholdRepository } from "@infrastructure/repositories/household.mock";

function createEventRepository(): EventRepository {
  return new MockEventRepository();
}

function createHouseholdRepository(): HouseholdRepository {
  return new MockHouseholdRepository();
}

export const diContainer = {
  getEventRepository: createEventRepository,
  getHouseholdRepository: createHouseholdRepository,
};

export type DiContainer = typeof diContainer;
