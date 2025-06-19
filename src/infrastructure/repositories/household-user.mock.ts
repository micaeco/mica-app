import { HouseholdUser } from "@domain/entities/household-user";
import { HouseholdUserRepository } from "@domain/repositories/household-user";

const mockHouseholdUsers: HouseholdUser[] = [];

export class MockHouseholdUserRepository implements HouseholdUserRepository {
  async create(householdUser: HouseholdUser) {
    mockHouseholdUsers.push(householdUser);
    return householdUser;
  }

  async findAll() {
    return mockHouseholdUsers;
  }

  async findById(householdId: string, userId: string) {
    return (
      mockHouseholdUsers.find(
        (relation) => relation.householdId === householdId && relation.userId === userId
      ) || null
    );
  }

  async findByUserId(userId: string) {
    return mockHouseholdUsers.filter((relation) => relation.userId === userId);
  }

  async findByHouseholdId(householdId: string) {
    return mockHouseholdUsers.filter((relation) => relation.householdId === householdId);
  }

  async findUsersByHouseholdId(householdId: string) {
    return mockHouseholdUsers
      .filter((relation) => relation.householdId === householdId)
      .map((relation) => relation.userId);
  }

  async findHouseholdsByUserId(userId: string) {
    return mockHouseholdUsers
      .filter((relation) => relation.userId === userId)
      .map((relation) => relation.householdId);
  }

  async updateRole(householdId: string, userId: string, role: HouseholdUser["role"]) {
    const index = mockHouseholdUsers.findIndex(
      (relation) => relation.householdId === householdId && relation.userId === userId
    );
    if (index === -1) {
      return null;
    }
    mockHouseholdUsers[index] = { ...mockHouseholdUsers[index], role };
    return mockHouseholdUsers[index];
  }

  async delete(householdId: string, userId: string) {
    const index = mockHouseholdUsers.findIndex(
      (relation) => relation.householdId === householdId && relation.userId === userId
    );
    if (index === -1) {
      return false;
    }
    mockHouseholdUsers.splice(index, 1);
    return true;
  }
}
