import { User } from "@core/entities/user";
import { UserRepository } from "@core/repositories/user";

const mockUsers: User[] = [
  {
    id: "1",
    name: "Gabriel Escobar",
    email: "gabriel.escobar@example.com",
    avatar: "/images/gabi.webp",
  },
  {
    id: "2",
    name: "Irene Escobar",
    email: "irene.escobar@example.com",
    avatar: "/images/irene.webp",
  },
  {
    id: "3",
    name: "Jaime Escobar",
    email: "jaime.escobar@example.com",
    avatar: "/images/jaime.webp",
  },
];

export class UserMockRepository implements UserRepository {
  async create(user: Omit<User, "id">) {
    const newUser: User = {
      ...user,
      id: String(mockUsers.length + 1),
    };
    mockUsers.push(newUser);
    return newUser;
  }

  async findAll() {
    return mockUsers;
  }

  async findById(userId: string) {
    return mockUsers.find((user) => user.id === userId) || null;
  }

  async findByEmail(email: string) {
    return mockUsers.find((user) => user.email === email) || null;
  }

  async update(id: string, user: Partial<User>) {
    const index = mockUsers.findIndex((user) => user.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...user };
      return mockUsers[index];
    }
    return null;
  }

  async delete(userId: string) {
    const index = mockUsers.findIndex((user) => user.id === userId);
    const user = mockUsers[index];
    mockUsers.splice(index, 1);
    return user;
  }
}
