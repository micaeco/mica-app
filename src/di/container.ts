import { ConsumptionRepository } from "@domain/repositories/consumption";
import { EventRepository } from "@domain/repositories/event";
import { HouseholdRepository } from "@domain/repositories/household";
import { HouseholdUserRepository } from "@domain/repositories/household-user";
import { SensorRepository } from "@domain/repositories/sensor";
import { TagRepository } from "@domain/repositories/tag";
import { UnitOfWork } from "@domain/services/unit-of-work";
import { db } from "@infrastructure/db/db";
import { ApiConsumptionRepository } from "@infrastructure/repositories/consumption.api";
import { ApiEventRepository } from "@infrastructure/repositories/event.api";
import { PostgresHouseholdUserRepository } from "@infrastructure/repositories/household-user.postgres";
import { PostgresHouseholdRepository } from "@infrastructure/repositories/household.postgres";
import { ApiSensorRepository } from "@infrastructure/repositories/sensor.api";
import { PostgresTagRepository } from "@infrastructure/repositories/tag.postgres";
import { DrizzleUnitOfWork } from "@infrastructure/services/unit-of-work.postgres";

interface Container {
  unitOfWork: UnitOfWork;
  eventRepo: EventRepository;
  householdRepo: HouseholdRepository;
  tagRepo: TagRepository;
  consumptionRepo: ConsumptionRepository;
  householdUserRepo: HouseholdUserRepository;
  sensorRepo: SensorRepository;
}

const unitOfWork = new DrizzleUnitOfWork(db);

const householdRepo: HouseholdRepository = new PostgresHouseholdRepository(db);
const householdUserRepo: HouseholdUserRepository = new PostgresHouseholdUserRepository(db);
const tagRepo: TagRepository = new PostgresTagRepository(db);

const eventRepo: EventRepository = new ApiEventRepository();
const consumptionRepo: ConsumptionRepository = new ApiConsumptionRepository(householdRepo);
const sensorRepo: SensorRepository = new ApiSensorRepository();

export function createContainer(): Container {
  return {
    unitOfWork,
    eventRepo,
    householdRepo,
    tagRepo,
    consumptionRepo,
    householdUserRepo,
    sensorRepo,
  };
}
