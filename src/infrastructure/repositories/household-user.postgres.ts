import { and, eq } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";

import { HouseholdUser } from "@domain/entities/household-user";
import { HouseholdUserRepository } from "@domain/repositories/household-user";
import { DbType } from "@infrastructure/db/db";
import { HouseholdUserSchema, householdUserSchema } from "@infrastructure/db/schema/household-user";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DrizzleTx = PgTransaction<any, any, any>;

export function mapHouseholdUserFromSchema(schema: HouseholdUserSchema): HouseholdUser {
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
      .insert(householdUserSchema)
      .values(householdUser)
      .returning();

    return mapHouseholdUserFromSchema(newHouseholdUser);
  }

  async findAll(): Promise<HouseholdUser[]> {
    const householdUsers = await this.db.select().from(householdUserSchema);
    return householdUsers.map(mapHouseholdUserFromSchema);
  }

  async findById(householdId: string, userId: string): Promise<HouseholdUser | null> {
    const [householdUser] = await this.db
      .select()
      .from(householdUserSchema)
      .where(
        and(
          eq(householdUserSchema.householdId, householdId),
          eq(householdUserSchema.userId, userId)
        )
      );

    if (!householdUser) return null;

    return mapHouseholdUserFromSchema(householdUser);
  }

  async findByUserId(userId: string): Promise<HouseholdUser[]> {
    const householdUsers = await this.db
      .select()
      .from(householdUserSchema)
      .where(eq(householdUserSchema.userId, userId));

    return householdUsers.map(mapHouseholdUserFromSchema);
  }

  async findByHouseholdId(householdId: string): Promise<HouseholdUser[]> {
    const householdUsers = await this.db
      .select()
      .from(householdUserSchema)
      .where(eq(householdUserSchema.householdId, householdId));

    return householdUsers.map(mapHouseholdUserFromSchema);
  }

  async findUsersByHouseholdId(householdId: string): Promise<string[]> {
    const householdUsers = await this.db
      .select({ userId: householdUserSchema.userId })
      .from(householdUserSchema)
      .where(eq(householdUserSchema.householdId, householdId));

    return householdUsers.map((relation) => relation.userId);
  }

  async findHouseholdsByUserId(userId: string): Promise<string[]> {
    const householdUsers = await this.db
      .select({ householdId: householdUserSchema.householdId })
      .from(householdUserSchema)
      .where(eq(householdUserSchema.userId, userId));

    return householdUsers.map((relation) => relation.householdId);
  }

  async updateRole(
    householdId: string,
    userId: string,
    role: HouseholdUser["role"]
  ): Promise<HouseholdUser | null> {
    const [updatedHouseholdUser] = await this.db
      .update(householdUserSchema)
      .set({
        role,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(householdUserSchema.householdId, householdId),
          eq(householdUserSchema.userId, userId)
        )
      )
      .returning();

    if (!updatedHouseholdUser) return null;

    return mapHouseholdUserFromSchema(updatedHouseholdUser);
  }

  async delete(householdId: string, userId: string): Promise<boolean> {
    const result = await this.db
      .delete(householdUserSchema)
      .where(
        and(
          eq(householdUserSchema.householdId, householdId),
          eq(householdUserSchema.userId, userId)
        )
      )
      .returning();

    return result.length > 0;
  }
}
