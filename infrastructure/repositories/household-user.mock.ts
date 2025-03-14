import { HouseholdUser } from "@core/entities/household-user";
import { HouseholdUserRepository } from "@core/repositories/household-user";
import { mockHouseholds } from "@infrastructure/repositories/household.mock";
import { mockUsers } from "@infrastructure/repositories/user.mock";

const mockHouseholdUsers: HouseholdUser[] = [
  {
    household: mockHouseholds[0],
    user: mockUsers[0],
    role: "admin",
  },
  {
    household: mockHouseholds[0],
    user: mockUsers[1],
    role: "member",
  },
  {
    household: mockHouseholds[1],
    user: mockUsers[0],
    role: "admin",
  },
  {
    household: mockHouseholds[1],
    user: mockUsers[2],
    role: "member",
  },
  {
    household: mockHouseholds[2],
    user: mockUsers[1],
    role: "admin",
  },
  {
    household: mockHouseholds[2],
    user: mockUsers[2],
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
        (relation) => relation.household.id === householdId && relation.user.id === userId
      ) || null
    );
  }

  async findByUserId(userId: string) {
    return mockHouseholdUsers.filter((relation) => relation.user.id === userId);
  }

  async findByHouseholdId(householdId: string) {
    return mockHouseholdUsers.filter((relation) => relation.household.id === householdId);
  }

  async findUsersByHouseholdId(householdId: string) {
    return mockHouseholdUsers
      .filter((relation) => relation.household.id === householdId)
      .map((relation) => relation.user);
  }

  async findHouseholdsByUserId(userId: string) {
    return mockHouseholdUsers
      .filter((relation) => relation.user.id === userId)
      .map((relation) => relation.household);
  }

  async updateRole(householdId: string, userId: string, role: HouseholdUser["role"]) {
    const index = mockHouseholdUsers.findIndex(
      (relation) => relation.household.id === householdId && relation.user.id === userId
    );
    if (index === -1) {
      return null;
    }
    mockHouseholdUsers[index] = { ...mockHouseholdUsers[index], role };
    return mockHouseholdUsers[index];
  }

  async delete(householdId: string, userId: string) {
    const index = mockHouseholdUsers.findIndex(
      (relation) => relation.household.id === householdId && relation.user.id === userId
    );
    if (index === -1) {
      return false;
    }
    mockHouseholdUsers.splice(index, 1);
    return true;
  }
}
