import { and, eq } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";

import { HouseholdUser } from "@domain/entities/household-user";
import { HouseholdUserRepository } from "@domain/repositories/household-user";
import { DbType } from "@infrastructure/db/db";
import {
  HouseholdUser as HouseholdUserTable,
  householdUser as householdUserTable,
} from "@infrastructure/db/schema/app/household-user";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DrizzleTx = PgTransaction<any, any, any>;

export function mapHouseholdUserFromSchema(schema: HouseholdUserTable): HouseholdUser {
  return {
    householdId: schema.householdId,
    userId: schema.userId,
    role: schema.role,
  };
}

export class PostgresHouseholdUserRepository implements HouseholdUserRepository {
  constructor(private db: DbType | DrizzleTx) {}

  async create(householdUser: HouseholdUser): Promise<HouseholdUser> {
    const [newHouseholdUser] = await this.db
      .insert(householdUserTable)
      .values(householdUser)
      .returning();

    return mapHouseholdUserFromSchema(newHouseholdUser);
  }

  async findAll(): Promise<HouseholdUser[]> {
    const householdUsers = await this.db.select().from(householdUserTable);
    return householdUsers.map(mapHouseholdUserFromSchema);
  }

  async findById(householdId: string, userId: string): Promise<HouseholdUser | null> {
    const [householdUser] = await this.db
      .select()
      .from(householdUserTable)
      .where(
        and(eq(householdUserTable.householdId, householdId), eq(householdUserTable.userId, userId))
      );

    if (!householdUser) return null;

    return mapHouseholdUserFromSchema(householdUser);
  }

  async findByUserId(userId: string): Promise<HouseholdUser[]> {
    const householdUsers = await this.db
      .select()
      .from(householdUserTable)
      .where(eq(householdUserTable.userId, userId));

    return householdUsers.map(mapHouseholdUserFromSchema);
  }

  async findByHouseholdId(householdId: string): Promise<HouseholdUser[]> {
    const householdUsers = await this.db
      .select()
      .from(householdUserTable)
      .where(eq(householdUserTable.householdId, householdId));

    return householdUsers.map(mapHouseholdUserFromSchema);
  }

  async findUsersByHouseholdId(householdId: string): Promise<string[]> {
    const householdUsers = await this.db
      .select({ userId: householdUserTable.userId })
      .from(householdUserTable)
      .where(eq(householdUserTable.householdId, householdId));

    return householdUsers.map((relation) => relation.userId);
  }

  async findHouseholdsByUserId(userId: string): Promise<string[]> {
    const householdUsers = await this.db
      .select({ householdId: householdUserTable.householdId })
      .from(householdUserTable)
      .where(eq(householdUserTable.userId, userId));

    return householdUsers.map((relation) => relation.householdId);
  }

  async updateRole(
    householdId: string,
    userId: string,
    role: HouseholdUser["role"]
  ): Promise<HouseholdUser | null> {
    const [updatedHouseholdUser] = await this.db
      .update(householdUserTable)
      .set({
        role,
        updatedAt: new Date(),
      })
      .where(
        and(eq(householdUserTable.householdId, householdId), eq(householdUserTable.userId, userId))
      )
      .returning();

    if (!updatedHouseholdUser) return null;

    return mapHouseholdUserFromSchema(updatedHouseholdUser);
  }

  async delete(householdId: string, userId: string): Promise<boolean> {
    const result = await this.db
      .delete(householdUserTable)
      .where(
        and(eq(householdUserTable.householdId, householdId), eq(householdUserTable.userId, userId))
      )
      .returning();

    return result.length > 0;
  }
}
