import { HouseholdInvitation } from "@domain/entities/household-invitation";

export interface HouseholdInvitationRepository {
  create(householdInvitation: Omit<HouseholdInvitation, "id">): Promise<HouseholdInvitation>;

  exists(email: string, householdId: string): Promise<HouseholdInvitation[] | null>;

  findById(id: number): Promise<HouseholdInvitation | null>;

  findByToken(token: string): Promise<HouseholdInvitation | null>;

  update(
    id: number,
    updates: Partial<Omit<HouseholdInvitation, "id" | "createdAt">>
  ): Promise<void>;

  delete(id: number): Promise<void>;
}
