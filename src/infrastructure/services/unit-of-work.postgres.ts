import { PgTransaction } from "drizzle-orm/pg-core";

import { HouseholdRepository } from "@domain/repositories/household";
import { HouseholdInvitationRepository } from "@domain/repositories/household-invitation";
import { HouseholdUserRepository } from "@domain/repositories/household-user";
import { TagRepository } from "@domain/repositories/tag";
import { UnitOfWork, Repositories } from "@domain/services/unit-of-work";
import { DbType } from "@infrastructure/db";
import { PostgresHouseholdInvitationRepository } from "@infrastructure/repositories/household-invitation.postgres";
import { PostgresHouseholdUserRepository } from "@infrastructure/repositories/household-user.postgres";
import { PostgresHouseholdRepository } from "@infrastructure/repositories/household.postgres";
import { PostgresTagRepository } from "@infrastructure/repositories/tag.postgres";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DrizzleTx = PgTransaction<any, any, any>;

export class DrizzleUnitOfWork implements UnitOfWork {
  constructor(private db: DbType) {}

  async execute<T>(callback: (repositories: Repositories) => Promise<T>): Promise<T> {
    return this.db.transaction(async (tx: DrizzleTx) => {
      const householdRepo: HouseholdRepository = new PostgresHouseholdRepository(tx);
      const householdInvitationRepo: HouseholdInvitationRepository =
        new PostgresHouseholdInvitationRepository(tx);
      const householdUserRepo: HouseholdUserRepository = new PostgresHouseholdUserRepository(tx);
      const tagRepo: TagRepository = new PostgresTagRepository(tx);

      const repositories: Repositories = {
        householdRepo,
        householdUserRepo,
        householdInvitationRepo,
        tagRepo,
      };

      try {
        const result = await callback(repositories);
        return result;
      } catch (error) {
        throw error;
      }
    });
  }
}
