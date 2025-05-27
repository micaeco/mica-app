import { ConsumptionRepository } from "@domain/repositories/consumption";
import { EventRepository } from "@domain/repositories/event";
import { HouseholdRepository } from "@domain/repositories/household";
import { TagRepository } from "@domain/repositories/tag";
import { MockConsumptionRepository } from "@infrastructure/repositories/consumption.mock";
import { MockEventRepository } from "@infrastructure/repositories/event.mock";
import { MockHouseholdRepository } from "@infrastructure/repositories/household.mock";
import { MockTagRepository } from "@infrastructure/repositories/tag.mock";

export function createContainer() {
  const eventRepo: EventRepository = new MockEventRepository();
  const householdRepo: HouseholdRepository = new MockHouseholdRepository();
  const tagRepo: TagRepository = new MockTagRepository();
  const consumptionRepo: ConsumptionRepository = new MockConsumptionRepository();

  return {
    eventRepo,
    householdRepo,
    tagRepo,
    consumptionRepo,
  };
}
