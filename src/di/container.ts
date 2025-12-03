import { ConsumptionRepository } from "@domain/repositories/consumption";
import { EventRepository } from "@domain/repositories/event";
import { HouseholdRepository } from "@domain/repositories/household";
import { HouseholdInvitationRepository } from "@domain/repositories/household-invitation";
import { HouseholdUserRepository } from "@domain/repositories/household-user";
import { SensorRepository } from "@domain/repositories/sensor";
import { TagRepository } from "@domain/repositories/tag";
import { UserRepository } from "@domain/repositories/user";
import { EmailService } from "@domain/services/email";
import { RecirculatorService } from "@domain/services/recirculator";
import { UnitOfWork } from "@domain/services/unit-of-work";
import { db } from "@infrastructure/db";
import { ApiConsumptionRepository } from "@infrastructure/repositories/consumption.api";
import { ApiEventRepository } from "@infrastructure/repositories/event.api";
import { PostgresHouseholdInvitationRepository } from "@infrastructure/repositories/household-invitation.postgres";
import { PostgresHouseholdUserRepository } from "@infrastructure/repositories/household-user.postgres";
import { PostgresHouseholdRepository } from "@infrastructure/repositories/household.postgres";
import { ApiSensorRepository } from "@infrastructure/repositories/sensor.api";
import { PostgresTagRepository } from "@infrastructure/repositories/tag.postgres";
import { PostgresUserRepository } from "@infrastructure/repositories/user.postgres";
import { SESEmailService } from "@infrastructure/services/email.ses";
import { IoTRecirculatorService } from "@infrastructure/services/recirculator.iot";
import { DrizzleUnitOfWork } from "@infrastructure/services/unit-of-work.postgres";

interface Container {
  unitOfWork: UnitOfWork;
  emailService: EmailService;
  recirculatorService: RecirculatorService;
  eventRepo: EventRepository;
  householdRepo: HouseholdRepository;
  tagRepo: TagRepository;
  consumptionRepo: ConsumptionRepository;
  userRepo: UserRepository;
  householdUserRepo: HouseholdUserRepository;
  householdInvitationRepo: HouseholdInvitationRepository;
  sensorRepo: SensorRepository;
}

const unitOfWork: UnitOfWork = new DrizzleUnitOfWork(db);
const emailService: EmailService = new SESEmailService();
const recirculatorService: RecirculatorService = new IoTRecirculatorService();

const userRepo: UserRepository = new PostgresUserRepository(db);
const householdRepo: HouseholdRepository = new PostgresHouseholdRepository(db);
const householdUserRepo: HouseholdUserRepository = new PostgresHouseholdUserRepository(db);
const householdInvitationRepo: HouseholdInvitationRepository =
  new PostgresHouseholdInvitationRepository(db);
const tagRepo: TagRepository = new PostgresTagRepository(db);

const eventRepo: EventRepository = new ApiEventRepository(tagRepo);
const consumptionRepo: ConsumptionRepository = new ApiConsumptionRepository(householdRepo);
const sensorRepo: SensorRepository = new ApiSensorRepository();

export function createContainer(): Container {
  return {
    unitOfWork,
    emailService,
    recirculatorService,
    eventRepo,
    userRepo,
    householdRepo,
    householdUserRepo,
    householdInvitationRepo,
    tagRepo,
    consumptionRepo,
    sensorRepo,
  };
}
