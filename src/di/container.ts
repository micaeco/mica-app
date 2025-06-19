import { ConsumptionRepository } from "@domain/repositories/consumption";
import { EventRepository } from "@domain/repositories/event";
import { HouseholdRepository } from "@domain/repositories/household";
import { HouseholdUserRepository } from "@domain/repositories/household-user";
import { SensorRepository } from "@domain/repositories/sensor";
import { TagRepository } from "@domain/repositories/tag";
import { db } from "@infrastructure/db/db";
import { MockConsumptionRepository } from "@infrastructure/repositories/consumption.mock";
import { MockEventRepository } from "@infrastructure/repositories/event.mock";
import { PostgresHouseholdUserRepository } from "@infrastructure/repositories/household-user.postgres";
import { PostgresHouseholdRepository } from "@infrastructure/repositories/household.postgres";
import { MockSensorRepository } from "@infrastructure/repositories/sensor.mock";
import { PostgresTagRepository } from "@infrastructure/repositories/tag.postgres";

interface Container {
  eventRepo: EventRepository;
  householdRepo: HouseholdRepository;
  tagRepo: TagRepository;
  consumptionRepo: ConsumptionRepository;
  householdUserRepo: HouseholdUserRepository;
  sensorRepo: SensorRepository;
}

const householdRepo: HouseholdRepository = new PostgresHouseholdRepository(db);
const householdUserRepo: HouseholdUserRepository = new PostgresHouseholdUserRepository(db);
const tagRepo: TagRepository = new PostgresTagRepository(db);

const eventRepo: EventRepository = new MockEventRepository();
const consumptionRepo: ConsumptionRepository = new MockConsumptionRepository();
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
