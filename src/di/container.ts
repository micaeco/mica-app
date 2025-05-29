import { ConsumptionRepository } from "@domain/repositories/consumption";
import { EventRepository } from "@domain/repositories/event";
import { HouseholdRepository } from "@domain/repositories/household";
import { HouseholdUserRepository } from "@domain/repositories/household-user";
import { SensorRepository } from "@domain/repositories/sensor";
import { TagRepository } from "@domain/repositories/tag";
import { MockConsumptionRepository } from "@infrastructure/repositories/consumption.mock";
import { MockEventRepository } from "@infrastructure/repositories/event.mock";
import { MockHouseholdUserRepository } from "@infrastructure/repositories/household-user.mock";
import { MockHouseholdRepository } from "@infrastructure/repositories/household.mock";
import { MockSensorRepository } from "@infrastructure/repositories/sensor.mock";
import { MockTagRepository } from "@infrastructure/repositories/tag.mock";

interface Container {
  eventRepo: EventRepository;
  householdRepo: HouseholdRepository;
  tagRepo: TagRepository;
  consumptionRepo: ConsumptionRepository;
  householdUserRepo: HouseholdUserRepository;
  sensorRepo: SensorRepository;
}

const householdRepo: HouseholdRepository = new MockHouseholdRepository();
const eventRepo: EventRepository = new MockEventRepository();
const tagRepo: TagRepository = new MockTagRepository();
const consumptionRepo: ConsumptionRepository = new MockConsumptionRepository();
const householdUserRepo: HouseholdUserRepository = new MockHouseholdUserRepository();
const sensorRepo: SensorRepository = new MockSensorRepository();

export function createContainer(): Container {
  return {
    eventRepo,
    householdRepo,
    tagRepo,
    consumptionRepo,
    householdUserRepo,
    sensorRepo,
  };
}
