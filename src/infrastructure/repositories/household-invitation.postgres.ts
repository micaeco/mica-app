import { and, eq } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";

import { HouseholdInvitation } from "@domain/entities/household-invitation";
import { HouseholdInvitationRepository } from "@domain/repositories/household-invitation";
import { DbType } from "@infrastructure/db";
import {
  HouseholdInvitation as HouseholdInvitationTable,
  householdInvitation as householdInvitationTable,
} from "@infrastructure/db/schema/app/household-invitation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DrizzleTx = PgTransaction<any, any, any>;

function mapHouseholdInvitationFromSchema(schema: HouseholdInvitationTable): HouseholdInvitation {
  return {
    id: schema.id,
    householdId: schema.householdId,
    invitedEmail: schema.invitedEmail,
    token: schema.token,
    inviterUserId: schema.inviterUserId || null,
    status: schema.status as "pending" | "accepted" | "declined" | "expired",
    createdAt: schema.createdAt,
    expiresAt: schema.expiresAt,
    acceptedAt: schema.acceptedAt || null,
  };
}

export class PostgresHouseholdInvitationRepository implements HouseholdInvitationRepository {
  constructor(private db: DbType | DrizzleTx) {}

  async create(householdInvitation: Omit<HouseholdInvitation, "id">): Promise<HouseholdInvitation> {
    const [newHouseholdInvitation] = await this.db
      .insert(householdInvitationTable)
      .values(householdInvitation)
      .returning();

    return mapHouseholdInvitationFromSchema(newHouseholdInvitation);
  }

  async exists(email: string, householdId: string): Promise<HouseholdInvitation[] | null> {
    const invitations = await this.db
      .select()
      .from(householdInvitationTable)
      .where(
        and(
          eq(householdInvitationTable.invitedEmail, email),
          eq(householdInvitationTable.householdId, householdId)
        )
      );

    return invitations.length > 0 ? invitations.map(mapHouseholdInvitationFromSchema) : null;
  }

  async findById(id: number): Promise<HouseholdInvitation | null> {
    const invitations = await this.db
      .select()
      .from(householdInvitationTable)
      .where(eq(householdInvitationTable.id, id));

    if (invitations.length === 0) {
      return null;
    }

    return mapHouseholdInvitationFromSchema(invitations[0]);
  }

  async findByToken(token: string): Promise<HouseholdInvitation | null> {
    const invitations = await this.db
      .select()
      .from(householdInvitationTable)
      .where(eq(householdInvitationTable.token, token));

    if (invitations.length === 0) {
      return null;
    }

    return mapHouseholdInvitationFromSchema(invitations[0]);
  }

  async update(
    id: number,
    updates: Partial<Omit<HouseholdInvitation, "id" | "createdAt">>
  ): Promise<void> {
    await this.db
      .update(householdInvitationTable)
      .set(updates)
      .where(eq(householdInvitationTable.id, id))
      .execute();
  }

  async delete(id: number): Promise<void> {
    await this.db
      .delete(householdInvitationTable)
      .where(eq(householdInvitationTable.id, id))
      .execute();
  }
}
