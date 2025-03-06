import { HouseholdUser } from "@core/entities/household-user";
import { HouseholdUserRepository } from "@core/repositories/household-user";

const mockHouseholdUsers: HouseholdUser[] = [
  {
    householdId: "1",
    userId: "1",
    role: "admin",
  },
  {
    householdId: "1",
    userId: "2",
    role: "member",
  },
  {
    householdId: "2",
    userId: "3",
    role: "admin",
  },
  {
    householdId: "3",
    userId: "4",
    role: "admin",
  },
  {
    householdId: "3",
    userId: "1",
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
