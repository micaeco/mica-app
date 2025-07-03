import { eq } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";

import { Household } from "@domain/entities/household";
import { HouseholdRepository } from "@domain/repositories/household";
import { DbType } from "@infrastructure/db/db";
import {
  Household as HouseholdTable,
  household as householdTable,
} from "@infrastructure/db/schema/app/household";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DrizzleTx = PgTransaction<any, any, any>;

export function mapHouseholdFromSchema(schema: HouseholdTable): Household {
  return {
    id: schema.id,
    sensorId: schema.sensorId,
    name: schema.name,
    icon: schema.icon || undefined,
    residents: schema.residents,
    street1: schema.street1 || undefined,
    street2: schema.street2 || undefined,
    city: schema.city || undefined,
    zip: schema.zip || undefined,
    country: schema.country || undefined,
  };
}

export class PostgresHouseholdRepository implements HouseholdRepository {
  constructor(private db: DbType | DrizzleTx) {}

  async create(household: Omit<Household, "id">): Promise<Household> {
    const [newHousehold] = await this.db
      .insert(householdTable)
      .values({
        ...household,
        id: crypto.randomUUID(),
      })
      .returning();

    return mapHouseholdFromSchema(newHousehold);
  }

  async exists(householdId: string): Promise<boolean> {
    const households = await this.db
      .select()
      .from(householdTable)
      .where(eq(householdTable.id, householdId));

    return households.length > 0;
  }

  async findAll(): Promise<Household[]> {
    const households = await this.db.select().from(householdTable);
    return households.map(mapHouseholdFromSchema);
  }

  async findById(householdId: string): Promise<Household | null> {
    const households = await this.db
      .select()
      .from(householdTable)
      .where(eq(householdTable.id, householdId));

    const household = households[0];
    if (!household) return null;

    return mapHouseholdFromSchema(household);
  }

  async findBySensorId(sensorId: string): Promise<Household | null> {
    const households = await this.db
      .select()
      .from(householdTable)
      .where(eq(householdTable.sensorId, sensorId));

    const household = households[0];
    if (!household) return null;

    return mapHouseholdFromSchema(household);
  }

  async findNumberOfResidents(householdId: string): Promise<number> {
    const [household] = await this.db
      .select({ residents: householdTable.residents })
      .from(householdTable)
      .where(eq(householdTable.id, householdId));

    return household?.residents || 1;
  }

  async update(householdId: string, updates: Partial<Household>): Promise<Household | null> {
    const updatedHouseholds = await this.db
      .update(householdTable)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(householdTable.id, householdId))
      .returning();

    const updatedHousehold = updatedHouseholds[0];
    if (!updatedHousehold) return null;

    return mapHouseholdFromSchema(updatedHousehold);
  }

  async delete(householdId: string): Promise<Household | null> {
    const deletedHouseholds = await this.db
      .delete(householdTable)
      .where(eq(householdTable.id, householdId))
      .returning();

    const deletedHousehold = deletedHouseholds[0];
    if (!deletedHousehold) return null;

    return mapHouseholdFromSchema(deletedHousehold);
  }
}
