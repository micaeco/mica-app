import { HouseholdUser } from "@core/entities/household-user";
import { HouseholdUserRepository } from "@core/repositories/household-user";
import { mockHouseholds } from "@infrastructure/repositories/household.mock";
import { mockUsers } from "@infrastructure/repositories/user.mock";

const mockHouseholdUsers: HouseholdUser[] = [
  {
    householdId: mockHouseholds[0].id,
    userId: mockUsers[0].id,
    role: "admin",
  },
  {
    householdId: mockHouseholds[0].id,
    userId: mockUsers[1].id,
    role: "member",
  },
  {
    householdId: mockHouseholds[1].id,
    userId: mockUsers[0].id,
    role: "admin",
  },
  {
    householdId: mockHouseholds[1].id,
    userId: mockUsers[2].id,
    role: "member",
  },
  {
    householdId: mockHouseholds[2].id,
    userId: mockUsers[1].id,
    role: "admin",
  },
  {
    householdId: mockHouseholds[2].id,
    userId: mockUsers[2].id,
    role: "member",
  },
];

export class HouseholdUserMockRepository implements HouseholdUserRepository {
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
